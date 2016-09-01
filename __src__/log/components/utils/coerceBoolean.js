/**
 * @file 类型转换
 * @author zhujianchen
 * @description
 * @param {string} val 输入
 * @return {string} val
 */
export default val => (
    typeof val !== 'string' ? val
        : val === 'true' ? true
        : val === 'false' ? false
        : val === 'null' ? false
        : val === 'undefined' ? false : val
    );
