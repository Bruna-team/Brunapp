
import { Quill } from '@vueup/vue-quill'

const Embed = Quill.import('blots/embed')
/**
 * SpanEmbed
 */
class SpanEmbed extends Embed {
  /**
   * Create span template
   * @param {*} value {text: String, id: String, type: String,}
   * @return {*} node
   */
  static create(value: {text: String, id: String, type: String,}) {
    const node = super.create();
    node.setAttribute('data-type', value.type);
    node.setAttribute('data-id', value.id);
    node.innerText = value.text;
    return node;
  }
}
// @ts-ignore
SpanEmbed.blotName = 'spanEmbed';
// @ts-ignore
SpanEmbed.tagName = 'span';
// @ts-ignore
SpanEmbed.className='editor-var';
export {SpanEmbed}