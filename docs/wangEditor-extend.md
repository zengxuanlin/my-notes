# 记录一次wangEditor富文本编辑器扩展自定义功能

```javascript
import Vue from 'vue'
import '@wangeditor/editor/dist/css/style.css'

import {Boot, SlateEditor, SlateElement, SlateTransforms} from '@wangeditor/editor'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {isEmpty, get} from 'lodash'
// 扩展wangEditor菜单功能
class updateImgSize {
  constructor() {
    this.title = '自定义尺寸'
    this.tag = 'button'
    this.showModal = true
    this.modalWidth = 300
  }
  isActive(editor) {
    return false
  }
  getValue(editor) {
    return ''
  }
  isDisabled() {
    return false
  }
  exec(editor, value) {}
  getModalPositionNode(editor) {
    return null
  }

  getModalContentElem(editor) {
    const mainDiv = document.createElement('div')
    const {w_id, w_node} = this.createWidthItem(mainDiv)
    const {h_id, h_node} = this.createHeightItem(mainDiv)
    this.createButton(mainDiv)

    mainDiv.addEventListener('click', function (event) {
      var target = event.target
      if (target.nodeName === 'BUTTON') {
        const w_value = document.querySelector(`#${w_id}`).value
        const h_value = document.querySelector(`#${h_id}`).value

        let pattern = /^\d+(\.\d{1,2})?$/
        if (pattern.test(w_value) && pattern.test(h_value)) {
          editor.restoreSelection() // 恢复选区
          SlateTransforms.setNodes(
            editor,
            {
              style: {
                width: w_value + 'px',
                height: h_value + 'px',
              },
            },
            {
              mode: 'highest',
              match: node => {
                if (SlateElement.isElement(node)) {
                  if (node.type === 'image') {
                    return true // 匹配 image
                  }
                }
              },
            }
          )
        } else {
          window.VUE.__proto__.$message.warning('请输入正确的值')
        }
      }
    })
    const curDom = this.geSelecedDom(editor)

    w_node.setAttribute(
      'value',
      get(curDom, ['style', 'width']) ? get(curDom, ['style', 'width']).replace('px', '') : ''
    )
    h_node.setAttribute(
      'value',
      get(curDom, ['style', 'height']) ? get(curDom, ['style', 'height']).replace('px', '') : ''
    )
    return mainDiv
  }

  /**
   * 获取当前选中的node节点
   * @param {*} editor
   * @returns
   */
  geSelecedDom(editor) {
    let dom = null
    const nodeEntries = SlateEditor.nodes(editor, {
      match: node => {
        if (SlateElement.isElement(node)) {
          if (node.type === 'image') {
            return true // 匹配 paragraph
          }
        }
        return false
      },
      universal: true,
    })

    if (nodeEntries == null) {
      console.log('当前未选中的 image')
    } else {
      for (let nodeEntry of nodeEntries) {
        const [node, path] = nodeEntry
        dom = node
      }
    }
    return dom
  }
  /**
   * 创建宽度
   */
  createWidthItem(container) {
    const inputId = `input-${Math.random().toString(16).slice(-8)}`
    const label = this.createDom('label', {class: 'babel-container'})
    const spanW = this.createDom('span', {}, '宽度')
    const iptW = this.createDom('input', {
      type: 'text',
      id: inputId,
    })
    label.appendChild(spanW)
    label.appendChild(iptW)
    container.appendChild(label)

    return {w_id: inputId, w_node: iptW}
  }
  /**
   * 创建高度
   */
  createHeightItem(container) {
    const inputId = `input-${Math.random().toString(16).slice(-8)}`
    const label = this.createDom('label', {class: 'babel-container'})
    const spanW = this.createDom('span', {}, '高度')
    const iptW = this.createDom('input', {
      type: 'text',
      id: inputId,
    })
    label.appendChild(spanW)
    label.appendChild(iptW)
    container.appendChild(label)

    return {h_id: inputId, h_node: iptW}
  }
  /**
   * 创建提交按钮
   * @returns
   */
  createButton(container) {
    const id = `button-${Math.random().toString(16).slice(-8)}`
    const _div = this.createDom('div', {class: 'button-container'})
    const _button = this.createDom(
      'button',
      {
        id,
        type: 'button',
      },
      '确定'
    )
    _div.appendChild(_button)
    container.appendChild(_div)
    return _button
  }
  /**
   * 创建dom
   * @param {*} tag
   * @param {*} props
   * @param {*} text
   * @returns
   */
  createDom(tag, props, text = '') {
    let dom = null
    dom = document.createElement(tag)
    if (!isEmpty(props)) {
      Object.keys(props).forEach(k => {
        dom.setAttribute(k, props[k])
      })
    }
    dom.innerText = text
    return dom
  }
}
const menuConf = {
  key: 'updateImgSize',
  factory() {
    return new updateImgSize()
  },
}

Boot.registerMenu(menuConf)
Vue.component('wangeditor', Editor)
Vue.component('wangeditor-toolbar', Toolbar)


```

```javascript
// 加载功能key
editorConfig: {
        placeholder: '请输入内容...',
        scroll: true, // 配置编辑器是否支持滚动
        hoverbarKeys: {
          image: {
            menuKeys: [
              // 重写image元素的hoverbar
              'imageWidth30',
              'imageWidth50',
              'imageWidth100',
              'editImage',
              'updateImgSize',
              'deleteImage',
            ],
          },
        },
      },
```

### wangEditor-扩展自定义功能的官方文档 [点此查看](https://www.wangeditor.com/v5/development.html)

