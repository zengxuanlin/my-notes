# 复杂密码校验

```javascript

/**
 * 是否包含3个及以上相同或字典连续字符
 */
function isContinuousChar(password) {
  let chars = []
  chars = password.split('')
  let charCode = []
  for (let i = 0; i < chars.length; i++) {
    charCode[i] = chars[i].charCodeAt(0)
  }
  for (let i = 0; i < charCode.length; i++) {
    let n1 = charCode[i]
    let n2 = charCode[i + 1]
    let n3 = charCode[i + 2]
    // 判断重复字符
    if (n1 == n2 && n1 == n3) {
      return true
    }
    // 判断连续字符： 正序 + 倒序
    if ((n1 + 1 == n2 && n1 + 2 == n3) || (n1 - 1 == n2 && n1 - 2 == n3)) {
      return true
    }
  }
  return false
}
// 不能包含特殊字符串
function validateSpecialName(val) {
  const specialName = [
    'admin',
    'root',
    'sa',
    // 'sys',
    'huawei',
    'zte',
    'cisco',
    'snmp',
    '123456',
    '111111',
  ]
  let state = false
  for (var i = 0; i < specialName.length; i++) {
    const specialString = specialName[i]
    if (val.toLowerCase().includes(specialString)) {
      state = true
    }
  }
  return state
}

function isKeyBoardContinuousChar(password) {
  if (password === '') {
    return false
  }
  /**
   * 键盘字符表(小写)
   * 非shift键盘字符表
   */
  const charTable1 = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ''],
    ['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '', ''],
    ['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '', '', ''],
  ]
  /**
   * shift键盘的字符表
   */
  const charTable2 = [
    ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', ''],
    ['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
    ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '', ''],
    ['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '', '', ''],
  ]
  //考虑大小写，都转换成小写字母
  let lpStrChars = []
  lpStrChars = password.toLowerCase().split('')
  // 获取字符串长度
  let nStrLen = lpStrChars.length
  // 定义位置数组：row - 行，col - column 列
  let pRowCharPos = []
  pRowCharPos = new Array(nStrLen).fill('')
  let pColCharPos = []
  pColCharPos = new Array(nStrLen).fill('')
  for (let i = 0; i < nStrLen; i++) {
    let chLower = lpStrChars[i]
    pColCharPos[i] = -1
    // 检索在表1中的位置，构建位置数组
    for (let nRowTable1Idx = 0; nRowTable1Idx < 4; nRowTable1Idx++) {
      for (let nColTable1Idx = 0; nColTable1Idx < 13; nColTable1Idx++) {
        if (chLower == charTable1[nRowTable1Idx][nColTable1Idx]) {
          pRowCharPos[i] = nRowTable1Idx
          pColCharPos[i] = nColTable1Idx
        }
      }
    }
    // 在表1中没找到，到表二中去找，找到则continue
    if (pColCharPos[i] >= 0) {
      continue
    }
    // 检索在表2中的位置，构建位置数组
    for (let nRowTable2Idx = 0; nRowTable2Idx < 4; nRowTable2Idx++) {
      for (let nColTable2Idx = 0; nColTable2Idx < 13; nColTable2Idx++) {
        if (chLower == charTable2[nRowTable2Idx][nColTable2Idx]) {
          pRowCharPos[i] = nRowTable2Idx
          pColCharPos[i] = nColTable2Idx
        }
      }
    }
    // 在表1中没找到，到表二中去找，找到则continue
    if (pColCharPos[i] >= 0) {
      continue
    }

    // 检索在表3中的位置，构建位置数组
    // for (let nRowTable3Idx = 0; nRowTable3Idx < 3; nRowTable3Idx++) {
    // 	for (let nColTable3Idx = 0; nColTable3Idx < 3; nColTable3Idx++) {
    // 		if (chLower == this.charTable3[nRowTable3Idx][nColTable3Idx]) {
    // 			pRowCharPos[i] = nRowTable3Idx;
    // 			pColCharPos[i] = nColTable3Idx;
    // 		}
    // 	}
    // }
  }
  // 匹配坐标连线
  for (let j = 1; j <= nStrLen - 2; j++) {
    //同一行
    if (pRowCharPos[j - 1] == pRowCharPos[j] && pRowCharPos[j] == pRowCharPos[j + 1]) {
      // 键盘行正向连续（asd）或者键盘行反向连续（dsa）
      if (
        (pColCharPos[j - 1] + 1 == pColCharPos[j] && pColCharPos[j] + 1 == pColCharPos[j + 1]) ||
        (pColCharPos[j + 1] + 1 == pColCharPos[j] && pColCharPos[j] + 1 == pColCharPos[j - 1])
      ) {
        return true
      }
    }
    //同一列
    if (pColCharPos[j - 1] == pColCharPos[j] && pColCharPos[j] == pColCharPos[j + 1]) {
      //键盘列连续（qaz）或者键盘列反向连续（zaq）
      if (
        (pRowCharPos[j - 1] + 1 == pRowCharPos[j] && pRowCharPos[j] + 1 == pRowCharPos[j + 1]) ||
        (pRowCharPos[j - 1] - 1 == pRowCharPos[j] && pRowCharPos[j] - 1 == pRowCharPos[j + 1])
      ) {
        return true
      }
    }
  }
  return false
}

export function pwdValidator(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  if (isContinuousChar(value)) {
    callback(new Error('请勿包含3个及以上相同或连续的字符'))
  }

  if (validateSpecialName(value)) {
    callback(new Error('不能包含特殊字符串'))
  }

  if (isKeyBoardContinuousChar(value)) {
    callback(new Error('不能包含3个及以上键盘连续字符'))
  }

  callback()
}

```

