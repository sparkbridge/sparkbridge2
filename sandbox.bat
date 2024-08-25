chcp 65001
@echo off
title 调试模式
REM 检测Node.js和node_modules文件夹的批处理脚本

REM 检测Node.js环境
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js 未安装或未添加到系统环境变量。
    goto end
)else (
    echo Node.js 已安装。
    node -v
)
REM 检测node_modules文件夹是否存在
if not exist node_modules (
    echo node_modules 文件夹不存在，正在尝试安装...
    REM 执行npm install
    npm install
    if %errorlevel% neq 0 (
        echo npm install 失败，请检查网络连接或npm配置。
        goto end
    ) else (
        echo npm install 完成。
    )
) else (
    echo node_modules 文件夹已存在。
)

echo 如果你是开服用户，你不需要打开这个文件，这是开发模拟用的。
npm run dev

:end
pause