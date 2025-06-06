const fs = require("fs");
const path = require("path");
const { decodeURIComponent } = require("url"); // Not strictly needed as path.resolve handles most encoding, but good for explicit decoding

// --- 配置项 ---
// 请确保这个路径是您 All-Notes 工作区的准确绝对路径
const WORKSPACE_ROOT = "/Users/bytedance/Desktop/other/mine/All-Notes";
// 重命名后的图片将存放于 WORKSPACE_ROOT 下的这个文件夹名中
const NEW_IMAGES_DIR_NAME = "standardized_images_js"; // Changed name slightly to avoid conflict if both scripts run
// 新图片文件名的前缀
const IMAGE_PREFIX = "img_js_";
// ----------------

/**
 * 递归查找指定目录下具有特定扩展名的所有文件。
 * @param {string} rootDir - 开始搜索的根目录。
 * @param {string} extension - 要查找的文件扩展名 (例如, ".png")。
 * @param {string[]} fileList - (内部使用) 累积文件列表。
 * @returns {string[]} 找到的文件路径数组。
 */
function findAllFilesWithExtension(rootDir, extension, fileList = []) {
  try {
    const files = fs.readdirSync(rootDir);
    files.forEach((file) => {
      const filePath = path.join(rootDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          // 排除新的图片目录，避免重复处理或处理自身生成的文件
          if (
            path.resolve(filePath) ===
            path.resolve(path.join(WORKSPACE_ROOT, NEW_IMAGES_DIR_NAME))
          ) {
            return;
          }
          findAllFilesWithExtension(filePath, extension, fileList);
        } else if (
          path.extname(filePath).toLowerCase() === extension.toLowerCase()
        ) {
          fileList.push(filePath);
        }
      } catch (statError) {
        console.warn(
          `  [警告] 无法获取文件状态 ${filePath}: ${statError.message}`
        );
      }
    });
  } catch (readDirError) {
    console.warn(`  [警告] 无法读取目录 ${rootDir}: ${readDirError.message}`);
  }
  return fileList;
}

/**
 * 为图片生成新的绝对路径。
 * @param {string} oldAbsPath - 图片的原始绝对路径。
 * @param {number} index - 图片的序号，用于生成新文件名。
 * @param {string} rootForNewImagesDir - 新图片存放目录的绝对路径。
 * @returns {string} 图片的新绝对路径。
 */
function generateNewImagePath(oldAbsPath, index, rootForNewImagesDir) {
  const originalExt = path.extname(oldAbsPath); // 保留原始扩展名，如 .png
  const newFilename = `${IMAGE_PREFIX}${index}${originalExt}`;
  return path.join(rootForNewImagesDir, newFilename);
}

/**
 * 主函数，执行图片重命名和 Markdown 链接更新。
 */
function main() {
  const workspacePath = path.resolve(WORKSPACE_ROOT);
  if (
    !fs.existsSync(workspacePath) ||
    !fs.statSync(workspacePath).isDirectory()
  ) {
    console.error(
      `错误：工作区路径 '${WORKSPACE_ROOT}' 不存在或不是一个目录。请检查 WORKSPACE_ROOT 设置。`
    );
    return;
  }

  const newImagesAbsDir = path.join(workspacePath, NEW_IMAGES_DIR_NAME);

  console.log(`将在以下目录创建/使用图片文件夹: ${newImagesAbsDir}`);
  if (!fs.existsSync(newImagesAbsDir)) {
    fs.mkdirSync(newImagesAbsDir, { recursive: true });
  }

  // 查找所有 .png 文件
  const allPngFilesInitially = findAllFilesWithExtension(workspacePath, ".png");
  // 排除可能已在新图片目录中的文件（用于脚本重跑）
  const pngFilesToProcess = allPngFilesInitially.filter(
    (p) => !path.resolve(p).startsWith(path.resolve(newImagesAbsDir))
  );

  const mdFiles = findAllFilesWithExtension(workspacePath, ".md");

  console.log(`找到 ${pngFilesToProcess.length} 个需要处理的 PNG 文件。`);
  console.log(`找到 ${mdFiles.length} 个 Markdown 文件。`);

  if (pngFilesToProcess.length === 0) {
    console.log("没有找到需要处理的 PNG 文件。脚本结束。");
    return;
  }

  // 1. 创建从旧图片绝对路径到新图片绝对路径的映射
  const imageRenameMapping = new Map(); // key: oldAbsPath (string), value: newAbsPath (string)

  // 对图片文件排序，确保每次运行时（如果文件集未变）命名一致性
  pngFilesToProcess.sort();

  pngFilesToProcess.forEach((oldAbsPathStr, i) => {
    const resolvedOldPath = path.resolve(oldAbsPathStr); // 确保是绝对且规范化的路径
    const newAbsPathStr = generateNewImagePath(
      resolvedOldPath,
      i + 1,
      newImagesAbsDir
    );
    imageRenameMapping.set(resolvedOldPath, path.resolve(newAbsPathStr));
  });

  // 2. 更新 Markdown 文件中的引用
  // Markdown 图片链接的正则表达式: ![alt text](image_path) 或 ![alt text](<image_path>)
  // 使用具名捕获组 (?<alt>...) 和 (?<link>...)
  const markdownLinkRegex = /!\[(?<alt>[^\]]*)\]\((?<link>[^)]+)\)/g;

  mdFiles.forEach((mdFilePathStr) => {
    const mdFileAbsPath = path.resolve(mdFilePathStr);
    const mdFileDir = path.dirname(mdFileAbsPath);

    console.log(`\n正在处理 Markdown 文件: ${mdFileAbsPath}`);

    try {
      let content = fs.readFileSync(mdFileAbsPath, "utf-8");
      const originalContent = content;

      content = content.replace(markdownLinkRegex, (match, ...args) => {
        // 兼容不同 Node.js 版本对 replace 回调参数的处理
        const groups =
          typeof args[args.length - 1] === "object"
            ? args[args.length - 1]
            : {};
        const altText = groups.alt !== undefined ? groups.alt : args[0]; // args[0] is the first capture group if not named
        let pathInMdRaw = groups.link !== undefined ? groups.link : args[1]; // args[1] is the second capture group

        pathInMdRaw = pathInMdRaw.trim();

        if (
          pathInMdRaw.startsWith("http://") ||
          pathInMdRaw.startsWith("https://") ||
          pathInMdRaw.startsWith("data:")
        ) {
          return match; // 跳过网页链接或 data URI
        }

        // 对路径中的 URL 编码字符进行解码 (例如 %20 代表空格)
        let pathInMdDecoded;
        try {
          pathInMdDecoded = decodeURIComponent(pathInMdRaw);
        } catch (e) {
          // 如果解码失败 (例如路径中包含未配对的 %), 则使用原始路径
          console.warn(
            `  [警告] 路径解码失败 '${pathInMdRaw}' in ${mdFileAbsPath}. 使用原始路径.`
          );
          pathInMdDecoded = pathInMdRaw;
        }

        let resolvedOldImgAbsPath;
        if (path.isAbsolute(pathInMdDecoded)) {
          resolvedOldImgAbsPath = path.resolve(pathInMdDecoded);
        } else if (pathInMdDecoded.startsWith("/")) {
          // 相对于工作区根目录 (Obsidian 风格)
          resolvedOldImgAbsPath = path.resolve(
            workspacePath,
            pathInMdDecoded.substring(1)
          );
        } else {
          // 相对于 MD 文件
          resolvedOldImgAbsPath = path.resolve(mdFileDir, pathInMdDecoded);
        }

        if (imageRenameMapping.has(resolvedOldImgAbsPath)) {
          const newImgAbsPathStr = imageRenameMapping.get(
            resolvedOldImgAbsPath
          );

          let newImgRelPathForMd = path.relative(mdFileDir, newImgAbsPathStr);
          // Markdown 中推荐使用 POSIX 风格的路径 (正斜杠)
          const newImgRelPathForMdPosix = newImgRelPathForMd
            .split(path.sep)
            .join("/");

          const newLinkMarkdown = `![${altText}](${newImgRelPathForMdPosix})`;
          console.log(
            `  已替换: '${pathInMdRaw}' -> '${newImgRelPathForMdPosix}'`
          );
          return newLinkMarkdown;
        }
        return match; // 如果图片不在映射中，则不修改此链接
      });

      if (content !== originalContent) {
        fs.writeFileSync(mdFileAbsPath, content, "utf-8");
        console.log(`  已更新文件: ${path.basename(mdFileAbsPath)}`);
      } else {
        console.log(`  文件无需更新: ${path.basename(mdFileAbsPath)}`);
      }
    } catch (e) {
      console.error(
        `处理 Markdown 文件 ${mdFileAbsPath} 时发生错误: ${e.message}`
      );
    }
  });

  // 3. 实际移动并重命名图片文件
  console.log("\n开始移动并重命名图片文件...");
  imageRenameMapping.forEach((newAbsPathStr, oldAbsPathStr) => {
    try {
      if (fs.existsSync(oldAbsPathStr)) {
        const newPathDir = path.dirname(newAbsPathStr);
        if (!fs.existsSync(newPathDir)) {
          fs.mkdirSync(newPathDir, { recursive: true });
        }
        fs.renameSync(oldAbsPathStr, newAbsPathStr);
        console.log(`  已移动: ${oldAbsPathStr} \n    -> 到: ${newAbsPathStr}`);
      } else {
        // This case might occur if a Markdown file references an image that was already moved
        // or if the image path in Markdown was incorrect to begin with.
        // The imageRenameMapping is built from *existing* files, so if oldAbsPathStr is a key,
        // it *should* exist unless moved by another part of this script run (which shouldn't happen here).
        // More likely, this indicates an image referenced in MD but not found during initial scan.
        console.warn(
          `  跳过 (源文件未找到): ${oldAbsPathStr} (可能已被处理或原始引用无效)`
        );
      }
    } catch (e) {
      console.error(
        `移动文件 ${oldAbsPathStr} 到 ${newAbsPathStr} 时发生错误: ${e.message}`
      );
    }
  });

  console.log("\n脚本执行完毕。");
  console.log(`所有重命名后的图片都已存放在: ${newImagesAbsDir}`);
}

if (require.main === module) {
  console.log("脚本已准备就绪。");
  console.log("运行前请务必：");
  console.log(
    `1. 确认 \`WORKSPACE_ROOT\` 变量 (当前为: '${WORKSPACE_ROOT}') 设置正确。`
  );
  console.log("2. 强烈建议备份您的整个工作区！");
  console.log(
    "确认无误后，直接运行此脚本 (例如: node rename_workspace_images.js)。"
  );

  // 运行主函数
  main();
}
