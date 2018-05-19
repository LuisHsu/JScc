# jscc

#### 為 [WasmVM](https://github.com/LuisHsu/WasmVM) ，以 Node.js 打造的 C 編譯器

A C compiler for [WasmVM](https://github.com/LuisHsu/WasmVM) with Node.js

## 注意事項 Notice

1. 目前只有前處理器 (pp.js) 是可以執行的

  There's only preprocessor (pp.js) workable currently.

2. **預設的 include 目前還不是 `/usr/include`，而是 `pp.js` 相同路徑下的 `include` 資料夾**

**The default include directory is the `include` directory in the same path of `pp.js`, instead of `/usr/include`.**

3. 在文件方面，本專案以 **台灣正體中文** 為主要使用語言，英文為次要使用語言，其他語言 （例如: 簡體中文）僅能做為參考或翻譯使用。

  This project uses **"Taiwan Traditional Chinese"** as primary, English as secondary language in documents.
  
  Other languages (Ex: Simplified Chinese) are only used as references or translations.
  
## 執行 Run

1. 準備好 C 語言原始檔

  Prepare your C source file

2. 執行 Run

> node jspp.js 輸入檔名 輸出檔名

> node jspp.js INPUTFILE OUTPUTFILE
