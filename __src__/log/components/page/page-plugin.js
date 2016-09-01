/**
 * @file 分页插件方式注册，支持多个实例
 * @author zhujianchen
 * @description 多个实例意味着可以动态创建多个page component，不用在html里硬编码写<page></page>
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof exports === 'object') {
        module.exports = exports.default = factory();
    }
    else {
        root.zPagenav = factory();
    }
}(this, function () {
    let zPagenav = {

        default: {
            page: 1,
            pageSize: 10,
            total: 0,
            prevHtml: '«',
            nextHtml: '»',
            prevSrHtml: 'Previous',
            nextSrHtml: 'Next',
            dotsHtml: '...',
            eventName: 'page-change',
            template: '<nav class="zpagenav" >'
                        + '<span class="pagination page-link m-r-1">total:{{total}}</span>'
                        + '<ul class="pagination">'
                        + '<li track-by="$index" v-for="unit in units" class="page-item {{unit.class}}" '
                        + ':disabled="unit.disabled">'
                        + '<a @click.prevent="setPage(unit.page)" '
                        + 'class="page-link" :href="setUrl(unit)" aria-label="{{unit.ariaLabel}}">'
                        + '<span v-if="unit.isPager" aria-hidden="true">{{{unit.html}}}</span>'
                        + '<span v-else>{{{unit.html}}}</span>'
                        + '<span v-if="unit.isPager" class="sr-only">{{{unit.srHtml}}}</span>'
                        + '</a>'
                        + '</li>' + '</ul>'
                        + '</nav>'
        }
    };

    zPagenav.install = function (Vue) {
        // define & register
        Vue.component('zpagenav', {
            template: zPagenav.default.template,
            props: {
                page: Number,
                total: Number,
                pageSize: Number,
                maxLink: Number,
                eventName: String,
                pageHandler: Function,
                createUrl: Function
            },
            methods: {
                setPage: function (page) {
                    if (page === this.page) {
                        return false;
                    }

                    if (this.pageHandler) {
                        this.pageHandler(page);
                    }
                    else if (this.$dispatch) {
                        this.$dispatch(this.eventName || zPagenav.default.eventName, page);
                    }

                },
                setUrl: function (unit) {
                    let url = this.createUrl ? this.createUrl(unit) : (unit.page > 1 ? '#page=' + unit.page : '');
                    return url;
                }
            },
            computed: {
                units: function () {
                    let option = zPagenav.default;
                    let th = this;
                    let page = th.page || option.page;
                    let pageSize = th.pageSize || option.pageSize;
                    let total = th.total || option.total;
                    let maxLink = th.maxLink > 5 ? th.maxLink : 5;

                    let linksCount = Math.ceil(total / pageSize);

                    if (page > linksCount) {
                        page = linksCount + 0;
                    }

                    let hasPrev = page > 1;
                    let hasNext = page < linksCount;
                    let realMaxLink = maxLink > linksCount ? linksCount : maxLink;
                    let len1;
                    let len2;
                    let len3;
                    let shouldInsertDots12;
                    let shouldInsertDots23;
                    let len2Start;
                    let len3Start;

                    let units = [];
                    let arr = computeLens();

                    units.push({
                        'class': hasPrev ? '' : 'disabled',
                        'page': hasPrev ? page - 1 : page,
                        'isPager': true,
                        'isPrev': true,
                        'isNext': false,
                        'html': option.prevHtml,
                        'srHtml': option.prevSrHtml,
                        'ariaLabel': option.prevSrHtml
                    });

                    let dotUnit = {
                        'class': 'disabled',
                        'page': page,
                        'isPager': false,
                        'isPrev': false,
                        'isNext': true,
                        'html': option.dotsHtml
                    };

                    for (let i = 0, len = arr.length; i < len; i++) {
                        pushUnit(arr[i]);
                    }

                    units.push({
                        'class': hasNext ? '' : 'disabled',
                        'page': hasNext ? page + 1 : page,
                        'isPager': true,
                        'isPrev': false,
                        'isNext': true,
                        'html': option.nextHtml,
                        'srHtml': option.nextSrHtml,
                        'ariaLabel': option.nextSrHtml
                    });

                    function pushUnit(i) {
                        if (typeof i === 'number') {
                            units.push({
                                'page': i,
                                'isPrev': false,
                                'isPager': false,
                                'disabled': false,
                                'class': i === page ? 'active' : '',
                                'isNext': false,
                                'html': i
                            });
                        }
                        else {
                            units.push(dotUnit);
                        }
                    }

                    function computeLens() {
                        let a4 = Math.floor((realMaxLink - 2) / 2);
                        let a5 = realMaxLink - 3 - a4;
                        let s2 = page - a4;
                        let s3 = page + a5;
                        if (s2 < 2) {
                            s2 = 2;
                        }
                        else if (s3 > linksCount) {
                            s2 = linksCount - (realMaxLink - 2);
                        }

                        let arr = [
                            1
                        ];
                        if (s2 > 2) {
                            arr.push('dot');
                        }

                        let it;
                        for (let i = 0, len = realMaxLink - 2 < 1 ? realMaxLink - 1 : realMaxLink - 2; i < len; i++) {
                            it = i + s2;
                            arr.push(it);
                        }
                        if (it < linksCount - 1) {
                            arr.push('dot');
                        }

                        if (it < linksCount) {
                            arr.push(linksCount);
                        }

                        return arr;
                    }

                    return units;
                    // end unit
                }
            }
        });
    };

    return zPagenav;
}));
