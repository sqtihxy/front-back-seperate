/**
 * @file 弹窗插件方式注册，支持多个实例
 * @author zhujianchen@baidu.com
 * @description 多个实例意味着可以动态创建多个dialog component，不用在html里硬编码写<dialog></dialog>
 * @param {Object} Vue
 */
function install(Vue) {

    let DialogConstructor = Vue.extend(require('./dialog.vue'));
    let dialogInstance = null;

    Object.defineProperty(Vue.prototype, '$dialog', {
        get() {
            return opt => {
                if (dialogInstance) {
                    return dialogInstance;
                }
                opt.data = opt.data || {};
                opt.data.dialogTransition = 'dialog-fadeIn';
                opt.data.isPlugin = true;
                dialogInstance = new DialogConstructor({
                    el: document.createElement('div'),
                    data() {
                        return opt.data;
                    },
                    propsData: opt.props
                });
                dialogInstance.$appendTo(document.body);
                return dialogInstance;
            };
        }

    });


    Vue.transition('dialog-fadeIn', {
        afterEnter(el) {
            console.log(el.__v_trans);
        },
        leave(el, done) {
            done();
        },
        afterLeave(el) {
            if (dialogInstance) {
                el.remove();
                dialogInstance.$destroy();
                dialogInstance = null;
            }

        }
    });

    Vue.transition('dialog-fadeInJs', {
        css: false,
        enter(el, done) {
            // 元素已被插入 DOM
            // 在动画结束后调用 done
            $(el)
                .css('opacity', 0)
                .animate({
                    opacity: 1
                }, 1000, done);
        },
        enterCancelled(el) {
            $(el).stop();
        },
        leave(el, done) {
            // 与 enter 相同

            /* 不执行done的话，
            等待过渡结束（监听 transitionend 事件）；
             从 DOM 中删除元素并删除 v-leave 类名；
             调用 afterLeave 钩子。
             这几步都不会执行了*/
            $(el).animate({
                opacity: 0
            }, 1000, done);
        },
        leaveCancelled(el) {
            $(el).stop();
        }
    });
}

if (window.Vue) {
    window.Vue.use(install);
}

module.exports = install;
