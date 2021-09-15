(this["webpackJsonpreact-calculator"]=this["webpackJsonpreact-calculator"]||[]).push([[0],{11:function(e,_,r){"use strict";r.r(_);r(1);var a=r(4),t=r.n(a),c=r(5),n=(r(17),r(0));var l=function(){return Object(n.jsxs)("div",{children:[Object(n.jsx)(c.a,{}),Object(n.jsx)("footer",{children:Object(n.jsxs)("p",{children:["Designed and Developed by ",Object(n.jsx)("a",{href:"https://www.eduard-mekler.com",children:"Eduard Mekler"})]})})]})};t.a.render(Object(n.jsx)(l,{}),document.querySelector("#root"))},17:function(e,_,r){},5:function(module,__webpack_exports__,__webpack_require__){"use strict";var E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(6),E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(7),E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(2),E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(10),E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(9),react__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(1),react__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__),_Display__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(8),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(0),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);function createState(e,_,r){return{currentValue:e,expression:_,lastAction:r}}var ACTION={CLEAR:null,ERROR:"error",OPERATOR:"operator",NEGATIVE:"negative",CALCULATION:"equals",NUMBER:"number"},OPERATOR={SUBTRACT:"-",ADD:"+",MULTIPLY:"*",DIVIDE:"/",CALCULATE:"=",CLEAR:"C"},DECIMAL=".",CLEAR_STATE=createState("0","",ACTION.CLEAR),ERROR_STATE=createState("ERROR","",ACTION.ERROR),BUTTON_DEFINITIONS=[["zero","one","two","three","four","five","six","seven","eight","nine"],{symbol:OPERATOR.CALCULATE,id:"equals"},{symbol:OPERATOR.ADD,id:"add"},{symbol:OPERATOR.SUBTRACT,id:"subtract"},{symbol:OPERATOR.MULTIPLY,id:"multiply"},{symbol:OPERATOR.DIVIDE,id:"divide"},{symbol:OPERATOR.CLEAR,id:"clear"},{symbol:DECIMAL,id:"decimal"}],Calculator=function(_React$Component){Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_3__.a)(Calculator,_React$Component);var _super=Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_createSuper__WEBPACK_IMPORTED_MODULE_4__.a)(Calculator);function Calculator(e){var _;return Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__.a)(this,Calculator),(_=_super.call(this,e)).state=CLEAR_STATE,_.handleClick=_.handleClick.bind(Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__.a)(_)),_.handleKeyPress=_.handleKeyPress.bind(Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__.a)(_)),_}return Object(E_Dropbox_Programming_learning_free_code_camp_react_calculator_node_modules_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__.a)(Calculator,[{key:"componentDidMount",value:function(){document.addEventListener("keydown",this.handleKeyPress)}},{key:"componentWillUnmount",value:function(){document.addEventListener("keydown",this.handleKeyPress)}},{key:"handleClick",value:function(e){switch(e.target.value){case OPERATOR.CLEAR:this.clear();break;case OPERATOR.CALCULATE:this.calculate();break;case OPERATOR.ADD:case OPERATOR.SUBTRACT:case OPERATOR.MULTIPLY:case OPERATOR.DIVIDE:this.handleOperator(e.target.value);break;default:this.handleNumber(e.target.value)}}},{key:"handleKeyPress",value:function(e){var _=e.key.replace("Enter",OPERATOR.CALCULATE).replace("Escape",OPERATOR.CLEAR).replace(/^F\d{1,2}|[^-1234567890./*+=C]+|^C.+/,"");_&&this.handleClick({target:{value:_}})}},{key:"clear",value:function(){this.setState(CLEAR_STATE)}},{key:"error",value:function(){var e=this;this.setState(ERROR_STATE),setTimeout((function(){e.clear()}),600)}},{key:"calculate",value:function calculate(){var _this3=this;this.setState((function(state){if(state.lastAction!==ACTION.CALCULATION&&state.lastAction!==ACTION.CLEAR){var result;try{result=Math.round(1e10*eval(state.expression.replace(/--/g,"- -")))/1e10}catch(_unused){_this3.error()}return createState(result,"".concat(state.expression,"=").concat(result),ACTION.CALCULATION)}return state}))}},{key:"handleOperator",value:function(e){var _=createState.bind(null,e);this.setState((function(r){switch(r.lastAction){case ACTION.CLEAR:if(e===OPERATOR.SUBTRACT)return _(e,ACTION.NEGATIVE);break;case ACTION.NEGATIVE:if(e!==OPERATOR.SUBTRACT)return r.expression.startsWith(OPERATOR.SUBTRACT)?_("0".concat(e),ACTION.OPERATOR):_("".concat(r.expression.replace(/[-/*+]-*$/,e)),ACTION.OPERATOR);break;case ACTION.OPERATOR:return e===OPERATOR.SUBTRACT?_("".concat(r.expression+e),ACTION.NEGATIVE):_("".concat(r.expression.replace(/[-/*+]-*$/,e)),ACTION.OPERATOR);case ACTION.CALCULATION:return _("".concat(r.currentValue+e),ACTION.OPERATOR);default:return _("".concat(r.expression+e),ACTION.OPERATOR)}}))}},{key:"handleNumber",value:function(e){this.setState((function(_){return _.currentValue===CLEAR_STATE.currentValue||_.lastAction===ACTION.CALCULATION?createState(e=e===DECIMAL?"0.":e,e,ACTION.NUMBER):(e=e===DECIMAL&&_.currentValue.includes(DECIMAL)?"":e,createState(_.currentValue.replace(/^[-/+*]/,"")+e,_.expression+e,ACTION.NUMBER))}))}},{key:"render",value:function(){var e=makeButtons(BUTTON_DEFINITIONS,this.handleClick);return Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div",{className:"calculator",children:[Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_Display__WEBPACK_IMPORTED_MODULE_6__.a,{currentValue:this.state.currentValue,expression:this.state.expression}),e]})}}]),Calculator}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);function makeButtons(e,_){function r(e,r){return Object(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("button",{className:"button",id:e,value:r,onClick:_,children:r},e)}return e.reduce((function(e,_){return Array.isArray(_)?_.forEach((function(_,a){e.push(r(_,a))})):e.push(r(_.id,_.symbol)),e}),[])}__webpack_exports__.a=Calculator},8:function(e,_,r){"use strict";r(1);var a=r(0);_.a=function(e){return Object(a.jsxs)("div",{className:"display",children:[Object(a.jsx)("div",{id:"currentValue",children:e.currentValue}),Object(a.jsx)("div",{id:"expression",children:e.expression})]})}}},[[11,1,2]]]);
//# sourceMappingURL=main.74c72221.chunk.js.map