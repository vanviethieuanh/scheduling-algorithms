var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function i(e){e.forEach(t)}function r(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function s(e){return null==e?"":e}function o(e,t){e.appendChild(t)}function a(e,t,n){e.insertBefore(t,n||null)}function c(e){e.parentNode.removeChild(e)}function u(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function d(e){return document.createTextNode(e)}function f(){return d(" ")}function h(){return d("")}function p(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function v(e){return""===e?null:+e}function T(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function b(e,t){e.value=null==t?"":t}let $;function y(e){$=e}function x(){const e=function(){if(!$)throw new Error("Function called outside component initialization");return $}();return(t,n,{cancelable:i=!1}={})=>{const r=e.$$.callbacks[t];if(r){const l=function(e,t,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(e,n,i,t),r}(t,n,{cancelable:i});return r.slice().forEach((t=>{t.call(e,l)})),!l.defaultPrevented}return!0}}const _=[],w=[],P=[],k=[],E=Promise.resolve();let N=!1;function M(e){P.push(e)}function S(e){k.push(e)}const H=new Set;let O=0;function A(){const e=$;do{for(;O<_.length;){const e=_[O];O++,y(e),F(e.$$)}for(y(null),_.length=0,O=0;w.length;)w.pop()();for(let e=0;e<P.length;e+=1){const t=P[e];H.has(t)||(H.add(t),t())}P.length=0}while(_.length);for(;k.length;)k.pop()();N=!1,H.clear(),y(e)}function F(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(M)}}const L=new Set;function q(e,t){e&&e.i&&(L.delete(e),e.i(t))}function R(e,t,n,i){if(e&&e.o){if(L.has(e))return;L.add(e),undefined.c.push((()=>{L.delete(e),i&&(n&&e.d(1),i())})),e.o(t)}else i&&i()}const C="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function z(e,t,n){const i=e.$$.props[t];void 0!==i&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function D(e){e&&e.c()}function V(e,n,l,s){const{fragment:o,on_mount:a,on_destroy:c,after_update:u}=e.$$;o&&o.m(n,l),s||M((()=>{const n=a.map(t).filter(r);c?c.push(...n):i(n),e.$$.on_mount=[]})),u.forEach(M)}function j(e,t){const n=e.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function I(e,t){-1===e.$$.dirty[0]&&(_.push(e),N||(N=!0,E.then(A)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function B(t,r,l,s,o,a,u,m=[-1]){const d=$;y(t);const f=t.$$={fragment:null,ctx:null,props:a,update:e,not_equal:o,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:r.target||d.$$.root};u&&u(f.root);let h=!1;if(f.ctx=l?l(t,r.props||{},((e,n,...i)=>{const r=i.length?i[0]:n;return f.ctx&&o(f.ctx[e],f.ctx[e]=r)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](r),h&&I(t,e)),n})):[],f.update(),h=!0,i(f.before_update),f.fragment=!!s&&s(f.ctx),r.target){if(r.hydrate){const e=function(e){return Array.from(e.childNodes)}(r.target);f.fragment&&f.fragment.l(e),e.forEach(c)}else f.fragment&&f.fragment.c();r.intro&&q(t.$$.fragment),V(t,r.target,r.anchor,r.customElement),A()}y(d)}class G{$destroy(){j(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}class J{constructor(e,t,n){this._periodName=e,this._periodStart=t,this._periodEnd=n}get periodName(){return this._periodName}get periodStart(){return this._periodStart}get periodEnd(){return this._periodEnd}}class Q{constructor(e,t,n,i){this._finishedTime=null,this._responseTime=null,this._executionPeriods=[],this.name=e,this.arrivalTime=t,this.burstTime=n,this.priority=i,this._remainingTime=n,this._waitTime=0,this._turnaroundTime=0}get finishedTime(){return this._finishedTime}get waitTime(){return this._waitTime}get turnaroundTime(){return this._turnaroundTime}get responseTime(){return this._responseTime}get endTime(){return Math.max(...this._executionPeriods.map((e=>e[1])))}get remainingTime(){return this._remainingTime}get isDone(){return this._remainingTime<=0}execute(e,t){let n=this._executionPeriods[this._executionPeriods.length-1];this._remainingTime-=e,n&&n[1]===t?n[1]+=e:this._executionPeriods.push([t,t+e]),null===this._responseTime&&(this._responseTime=t-this.arrivalTime),this._remainingTime<=0&&(this._finishedTime=t+e,this._waitTime=this._finishedTime-this.arrivalTime-this.burstTime,this._turnaroundTime=this._finishedTime-this.arrivalTime)}toGranttPeriods(){return this._executionPeriods.map((([e,t])=>new J(this.name,e,t)))}clearCache(){this._executionPeriods=[]}reset(){this._remainingTime=this.burstTime,this._waitTime=0,this._turnaroundTime=0,this._finishedTime=null,this._responseTime=null}}function U(e,t,n){const i=e.slice();return i[15]=t[n],i}function W(e,t,n){const i=e.slice();return i[18]=t[n],i[20]=n,i}function K(e,t,n){const i=e.slice();return i[15]=t[n],i[22]=n,i}function X(e,t,n){const i=e.slice();return i[15]=t[n],i}function Y(e){let t,n,i,r,l;function s(...t){return e[8](e[15],...t)}return{c(){t=m("button"),n=m("i"),g(n,"class","fa-solid fa-copy"),t.disabled=i=!e[15].copyable,g(t,"class","svelte-hmn8vv")},m(e,i){a(e,t,i),o(t,n),r||(l=p(t,"click",s),r=!0)},p(n,r){e=n,2&r&&i!==(i=!e[15].copyable)&&(t.disabled=i)},d(e){e&&c(t),r=!1,l()}}}function Z(e){let t,n,i,r,l,s=e[15].title+"",u=e[15].copyable&&Y(e);return{c(){t=m("th"),n=m("div"),i=m("h5"),r=d(s),l=f(),u&&u.c(),g(n,"class","header svelte-hmn8vv"),g(t,"class","svelte-hmn8vv")},m(e,s){a(e,t,s),o(t,n),o(n,i),o(i,r),o(n,l),u&&u.m(n,null)},p(e,t){2&t&&s!==(s=e[15].title+"")&&T(r,s),e[15].copyable?u?u.p(e,t):(u=Y(e),u.c(),u.m(n,null)):u&&(u.d(1),u=null)},d(e){e&&c(t),u&&u.d()}}}function ee(e){let t,n=e[15].getter(e[18])+"";return{c(){t=d(n)},m(e,n){a(e,t,n)},p(e,i){6&i&&n!==(n=e[15].getter(e[18])+"")&&T(t,n)},d(e){e&&c(t)}}}function te(e){let t;function n(e,t){return"number"===e[15].dataType?ie:ne}let i=n(e),r=i(e);return{c(){r.c(),t=h()},m(e,n){r.m(e,n),a(e,t,n)},p(e,l){i===(i=n(e))&&r?r.p(e,l):(r.d(1),r=i(e),r&&(r.c(),r.m(t.parentNode,t)))},d(e){r.d(e),e&&c(t)}}}function ne(e){let t,n,i,r;function l(...t){return e[10](e[15],e[20],...t)}return{c(){t=m("input"),g(t,"type","text"),t.value=n=e[15].getter(e[18]),g(t,"class","svelte-hmn8vv")},m(e,n){a(e,t,n),i||(r=p(t,"input",l),i=!0)},p(i,r){e=i,6&r&&n!==(n=e[15].getter(e[18]))&&t.value!==n&&(t.value=n)},d(e){e&&c(t),i=!1,r()}}}function ie(e){let t,n,i,r,l,s,o;function u(...t){return e[9](e[15],e[20],...t)}return{c(){t=m("input"),g(t,"type",n=e[15].dataType),g(t,"min",i=e[15].min??"unset"),t.disabled=r=!e[15].editable,t.value=l=e[15].getter(e[18]),g(t,"class","svelte-hmn8vv")},m(e,n){a(e,t,n),s||(o=p(t,"input",u),s=!0)},p(s,o){e=s,2&o&&n!==(n=e[15].dataType)&&g(t,"type",n),2&o&&i!==(i=e[15].min??"unset")&&g(t,"min",i),2&o&&r!==(r=!e[15].editable)&&(t.disabled=r),6&o&&l!==(l=e[15].getter(e[18]))&&t.value!==l&&(t.value=l)},d(e){e&&c(t),s=!1,o()}}}function re(e){let t,n;function i(e,t){return e[15].editable?te:ee}let r=i(e),l=r(e);return{c(){t=m("td"),l.c(),n=f(),g(t,"class","svelte-hmn8vv")},m(e,i){a(e,t,i),l.m(t,null),o(t,n)},p(e,s){r===(r=i(e))&&l?l.p(e,s):(l.d(1),l=r(e),l&&(l.c(),l.m(t,n)))},d(e){e&&c(t),l.d()}}}function le(e){let t,n,i,r;function l(...t){return e[11](e[20],...t)}return{c(){t=m("td"),n=m("button"),n.innerHTML='<i class="fa-solid fa-trash-can"></i>',g(n,"name","delete"),g(n,"class","svelte-hmn8vv"),g(t,"class","svelte-hmn8vv")},m(e,s){a(e,t,s),o(t,n),i||(r=p(n,"click",l),i=!0)},p(t,n){e=t},d(e){e&&c(t),i=!1,r()}}}function se(e){let t,n,i=e[1],r=[];for(let t=0;t<i.length;t+=1)r[t]=re(K(e,i,t));let l=e[0].length>1&&le(e);return{c(){t=m("tr");for(let e=0;e<r.length;e+=1)r[e].c();n=f(),l&&l.c(),g(t,"class","svelte-hmn8vv")},m(e,i){a(e,t,i);for(let e=0;e<r.length;e+=1)r[e].m(t,null);o(t,n),l&&l.m(t,null)},p(e,s){if(54&s){let l;for(i=e[1],l=0;l<i.length;l+=1){const o=K(e,i,l);r[l]?r[l].p(o,s):(r[l]=re(o),r[l].c(),r[l].m(t,n))}for(;l<r.length;l+=1)r[l].d(1);r.length=i.length}e[0].length>1?l?l.p(e,s):(l=le(e),l.c(),l.m(t,null)):l&&(l.d(1),l=null)},d(e){e&&c(t),u(r,e),l&&l.d()}}}function oe(e){let t,n,i,r,l,s,u,h,v,b=me(e[2],e[15].getter)+"";function $(...t){return e[12](e[15],...t)}return{c(){t=m("td"),n=d(b),i=f(),r=m("button"),l=m("i"),u=f(),g(l,"class","fa-solid fa-copy"),r.disabled=s=!e[15].copyable,g(r,"class","svelte-hmn8vv"),g(t,"class","svelte-hmn8vv")},m(e,s){a(e,t,s),o(t,n),o(t,i),o(t,r),o(r,l),o(t,u),h||(v=p(r,"click",$),h=!0)},p(t,i){e=t,6&i&&b!==(b=me(e[2],e[15].getter)+"")&&T(n,b),2&i&&s!==(s=!e[15].copyable)&&(r.disabled=s)},d(e){e&&c(t),h=!1,v()}}}function ae(e){let t,n=e[15].avg&&oe(e);return{c(){n&&n.c(),t=h()},m(e,i){n&&n.m(e,i),a(e,t,i)},p(e,i){e[15].avg?n?n.p(e,i):(n=oe(e),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&c(t)}}}function ce(t){let n,i,r,l,s,h,v,T,b,$,y,x,_,w,P,k,E=t[1],N=[];for(let e=0;e<E.length;e+=1)N[e]=Z(X(t,E,e));let M=t[2],S=[];for(let e=0;e<M.length;e+=1)S[e]=se(W(t,M,e));let H=t[1],O=[];for(let e=0;e<H.length;e+=1)O[e]=ae(U(t,H,e));return{c(){n=m("div"),i=m("table"),r=m("thead"),l=m("tr");for(let e=0;e<N.length;e+=1)N[e].c();s=f(),h=m("button"),h.innerHTML='<i class="fa-solid fa-plus"></i>',v=f(),T=m("tbody");for(let e=0;e<S.length;e+=1)S[e].c();b=f(),$=m("tr"),y=m("td"),x=d("Average"),w=f();for(let e=0;e<O.length;e+=1)O[e].c();g(h,"id","add-row"),g(h,"class","svelte-hmn8vv"),g(l,"class","svelte-hmn8vv"),g(r,"class","svelte-hmn8vv"),g(y,"colspan",_=t[1].filter(de).length),g(y,"class","svelte-hmn8vv"),g($,"class","svelte-hmn8vv"),g(T,"class","svelte-hmn8vv"),g(i,"class","svelte-hmn8vv"),g(n,"class","component svelte-hmn8vv")},m(e,c){a(e,n,c),o(n,i),o(i,r),o(r,l);for(let e=0;e<N.length;e+=1)N[e].m(l,null);o(l,s),o(l,h),o(i,v),o(i,T);for(let e=0;e<S.length;e+=1)S[e].m(T,null);o(T,b),o(T,$),o($,y),o(y,x),o($,w);for(let e=0;e<O.length;e+=1)O[e].m($,null);P||(k=p(h,"click",t[7]),P=!0)},p(e,[t]){if(10&t){let n;for(E=e[1],n=0;n<E.length;n+=1){const i=X(e,E,n);N[n]?N[n].p(i,t):(N[n]=Z(i),N[n].c(),N[n].m(l,s))}for(;n<N.length;n+=1)N[n].d(1);N.length=E.length}if(119&t){let n;for(M=e[2],n=0;n<M.length;n+=1){const i=W(e,M,n);S[n]?S[n].p(i,t):(S[n]=se(i),S[n].c(),S[n].m(T,b))}for(;n<S.length;n+=1)S[n].d(1);S.length=M.length}if(2&t&&_!==(_=e[1].filter(de).length)&&g(y,"colspan",_),6&t){let n;for(H=e[1],n=0;n<H.length;n+=1){const i=U(e,H,n);O[n]?O[n].p(i,t):(O[n]=ae(i),O[n].c(),O[n].m($,null))}for(;n<O.length;n+=1)O[n].d(1);O.length=H.length}},i:e,o:e,d(e){e&&c(n),u(N,e),u(S,e),u(O,e),P=!1,k()}}}function ue(e){navigator.clipboard.writeText(e)}function me(e,t){return e.map((e=>t(e))).reduce(((e,t)=>e+t),0)/e.length}const de=e=>e.avg;function fe(e,t,n){const i=x();let r=6,{columnsMapper:l=[]}=t,{processes:s=[]}=t,{calculatedProcesses:o}=t;function a(e,t){const n=s.map((t=>e(t))),i=t?t(n):(e=>e.join(","))(n);ue(i)}function c(e,t,n){const r=e.target,l=Number(r.value);r.value=l.toString(),t(s[n],l),i("change",{data:s})}function u(e,t,n){const r=e.target,l=r.value.slice(0,10);r.value=l,t(s[n],l),i("change",{data:s})}function m(e){n(0,s=s.filter(((t,n)=>n!==e)))}return e.$$set=e=>{"columnsMapper"in e&&n(1,l=e.columnsMapper),"processes"in e&&n(0,s=e.processes),"calculatedProcesses"in e&&n(2,o=e.calculatedProcesses)},[s,l,o,a,c,u,m,function(){10!==s.length&&(n(0,s=[...s,new Q(`P-${r}`,0,1,0)]),r+=1)},(e,t)=>a(e.getter,e.copyMapper),(e,t,n)=>c(n,e.setter,t),(e,t,n)=>u(n,e.setter,t),(e,t)=>m(e),(e,t)=>ue(me(o,e.getter).toString())]}class he extends G{constructor(e){super(),B(this,e,fe,ce,l,{columnsMapper:1,processes:0,calculatedProcesses:2})}}function pe(e,t,n){const i=e.slice();return i[7]=t[n],i[9]=n,i}function ge(e,t,n){const i=e.slice();return i[10]=t[n],i[9]=n,i}function ve(e,t,n){const i=e.slice();return i[12]=t[n],i}function Te(e){let t,n,i,r=e[12].periodName+"";return{c(){t=m("div"),n=d(r),g(t,"class","grantt svelte-o5p54z"),g(t,"style",i=`\n                                --start: ${e[12].periodStart+2};\n                                --end: ${e[12].periodEnd+2};\n                                --rows: ${e[9]+2};\n\n                                --color: ${e[5](e[9])};\n                                --shadow-color: ${e[5](e[9])}4f;\n                            `)},m(e,i){a(e,t,i),o(t,n)},p(e,l){1&l&&r!==(r=e[12].periodName+"")&&T(n,r),1&l&&i!==(i=`\n                                --start: ${e[12].periodStart+2};\n                                --end: ${e[12].periodEnd+2};\n                                --rows: ${e[9]+2};\n\n                                --color: ${e[5](e[9])};\n                                --shadow-color: ${e[5](e[9])}4f;\n                            `)&&g(t,"style",i)},d(e){e&&c(t)}}}function be(e){let t,n=e[12].periodName===e[10]&&Te(e);return{c(){n&&n.c(),t=h()},m(e,i){n&&n.m(e,i),a(e,t,i)},p(e,i){e[12].periodName===e[10]?n?n.p(e,i):(n=Te(e),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},d(e){n&&n.d(e),e&&c(t)}}}function $e(e){let t,n,i,r,l=e[10]+"",s=e[0],p=[];for(let t=0;t<s.length;t+=1)p[t]=be(ve(e,s,t));return{c(){t=m("div"),n=d(l),i=f();for(let e=0;e<p.length;e+=1)p[e].c();r=h(),g(t,"class","title svelte-o5p54z"),g(t,"style",`\n                --rows: ${e[9]+2}\n            `)},m(e,l){a(e,t,l),o(t,n),a(e,i,l);for(let t=0;t<p.length;t+=1)p[t].m(e,l);a(e,r,l)},p(e,t){if(2&t&&l!==(l=e[10]+"")&&T(n,l),35&t){let n;for(s=e[0],n=0;n<s.length;n+=1){const i=ve(e,s,n);p[n]?p[n].p(i,t):(p[n]=be(i),p[n].c(),p[n].m(r.parentNode,r))}for(;n<p.length;n+=1)p[n].d(1);p.length=s.length}},d(e){e&&c(t),e&&c(i),u(p,e),e&&c(r)}}}function ye(e){let t,n,i;return{c(){t=m("div"),n=d(e[9]),g(t,"class",i=s(e[2].includes(e[9])?"time stamp":"time")+" svelte-o5p54z"),g(t,"style",`\n                --cols: ${e[9]+2};\n                `)},m(e,i){a(e,t,i),o(t,n)},p(e,n){4&n&&i!==(i=s(e[2].includes(e[9])?"time stamp":"time")+" svelte-o5p54z")&&g(t,"class",i)},d(e){e&&c(t)}}}function xe(t){let n,i,r,l,s,h,p,v,b=t[1],$=[];for(let e=0;e<b.length;e+=1)$[e]=$e(ge(t,b,e));let y=Array(t[4]),x=[];for(let e=0;e<y.length;e+=1)x[e]=ye(pe(t,y,e));return{c(){n=m("div"),i=m("div");for(let e=0;e<$.length;e+=1)$[e].c();r=f();for(let e=0;e<x.length;e+=1)x[e].c();l=f(),s=m("div"),h=d(t[4]),g(s,"class","time last stamp svelte-o5p54z"),g(s,"style",p=`\n                --cols: ${t[4]+1};\n            `),g(i,"class","table svelte-o5p54z"),g(i,"style",v=`\n            --cols: ${t[4]};\n            --rows: ${t[3]}\n        `),g(n,"class","component svelte-o5p54z")},m(e,t){a(e,n,t),o(n,i);for(let e=0;e<$.length;e+=1)$[e].m(i,null);o(i,r);for(let e=0;e<x.length;e+=1)x[e].m(i,null);o(i,l),o(i,s),o(s,h)},p(e,[t]){if(35&t){let n;for(b=e[1],n=0;n<b.length;n+=1){const l=ge(e,b,n);$[n]?$[n].p(l,t):($[n]=$e(l),$[n].c(),$[n].m(i,r))}for(;n<$.length;n+=1)$[n].d(1);$.length=b.length}if(20&t){let n;for(y=Array(e[4]),n=0;n<y.length;n+=1){const r=pe(e,y,n);x[n]?x[n].p(r,t):(x[n]=ye(r),x[n].c(),x[n].m(i,l))}for(;n<x.length;n+=1)x[n].d(1);x.length=y.length}16&t&&T(h,e[4]),16&t&&p!==(p=`\n                --cols: ${e[4]+1};\n            `)&&g(s,"style",p),24&t&&v!==(v=`\n            --cols: ${e[4]};\n            --rows: ${e[3]}\n        `)&&g(i,"style",v)},i:e,o:e,d(e){e&&c(n),u($,e),u(x,e)}}}function _e(e,t,n){let i,r,l,s;const o=["#5800FF"];let{runs:a=[]}=t;return e.$$set=e=>{"runs"in e&&n(0,a=e.runs)},e.$$.update=()=>{1&e.$$.dirty&&n(1,i=[...new Set(a.map((e=>e.periodName)))]),1&e.$$.dirty&&n(4,r=Math.max(...a.map((e=>e.periodEnd)))),2&e.$$.dirty&&n(3,l=i.length),1&e.$$.dirty&&n(2,s=[0,...a.map((e=>e.periodEnd))])},[a,i,s,l,r,function(e){return o[e%o.length]}]}class we extends G{constructor(e){super(),B(this,e,_e,xe,l,{runs:0})}}function Pe(e){e.forEach((e=>e.clearCache())),e.forEach((e=>e.reset()))}function ke(e,t){return(t-e.arrivalTime+e.burstTime)/e.burstTime}function Ee(e,t){Pe(e);const n=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let i=e[0].arrivalTime,r=[],l=[];for(l.push(e.shift());l.length>0;){let t=l.shift();if(t.execute(t.burstTime,i),i+=t.burstTime,r.push(t),e.length>0){let t=e.filter((e=>e.arrivalTime<=i));l=l.concat(t),e=e.filter((e=>e.arrivalTime>i))}l.sort(((e,t)=>e.burstTime-t.burstTime))}return r.sort(((e,t)=>n.indexOf(e.name)-n.indexOf(t.name))),r}function Ne(e,t){var n,i;Pe(e);const r=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let l=e[0].arrivalTime,s=[],o=[];for(o.push(e.shift());e.length>0||o.length>0;){let t=o[0],r=(null!==(i=null===(n=e[0])||void 0===n?void 0:n.arrivalTime)&&void 0!==i?i:1/0)-l,a=Math.min(t.remainingTime,r);if(t.execute(a,l),l+=a,e.length>0){let t=e.filter((e=>e.arrivalTime<=l));o=o.concat(t),e=e.filter((e=>e.arrivalTime>l))}o=o.filter((e=>!e.isDone||(s.push(e),!1))),o.sort(((e,t)=>e.remainingTime-t.remainingTime))}return s.sort(((e,t)=>r.indexOf(e.name)-r.indexOf(t.name))),s}function Me(e,t){Pe(e),e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let n=0;return e.forEach((e=>{e.execute(e.burstTime,n),n+=e.burstTime})),e}function Se(e,t){var n,i;Pe(e);const r=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let l=e[0].arrivalTime,s=[],o=[];for(o.push(e.shift());e.length>0||o.length>0;){let t=o[0],r=(null!==(i=null===(n=e[0])||void 0===n?void 0:n.arrivalTime)&&void 0!==i?i:1/0)-l,a=Math.min(t.remainingTime,r);if(t.execute(a,l),l+=a,e.length>0){let t=e.filter((e=>e.arrivalTime<=l));o=o.concat(t),e=e.filter((e=>e.arrivalTime>l))}o=o.filter((e=>!e.isDone||(s.push(e),!1))),o.sort(((e,t)=>e.priority-t.priority))}return s.sort(((e,t)=>r.indexOf(e.name)-r.indexOf(t.name))),s}function He(e,t){Pe(e);const n=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let i=e[0].arrivalTime,r=[],l=[];for(l.push(e.shift());e.length>0||l.length>0;){let t=l[0],n=t.burstTime;if(t.execute(n,i),i+=n,e.length>0){let t=e.filter((e=>e.arrivalTime<=i));l=l.concat(t),e=e.filter((e=>e.arrivalTime>i))}l=l.filter((e=>!e.isDone||(r.push(e),!1))),l.sort(((e,t)=>e.priority-t.priority))}return r.sort(((e,t)=>n.indexOf(e.name)-n.indexOf(t.name))),r}function Oe(e,t){var n;const i=null!==(n=null==t?void 0:t.quantumnTime)&&void 0!==n?n:1;Pe(e);const r=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let l=e[0].arrivalTime,s=[],o=[];for(o.push(e.shift());e.length>0||o.length>0;){let t=o.shift(),n=Math.min(t.remainingTime,i);if(t.execute(n,l),l+=n,e.length>0){let t=e.filter((e=>e.arrivalTime<=l));o=o.concat(t),e=e.filter((e=>e.arrivalTime>l))}o.push(t),o=o.filter((e=>!e.isDone||(s.push(e),!1)))}return s.sort(((e,t)=>r.indexOf(e.name)-r.indexOf(t.name))),s}function Ae(e,t){Pe(e);const n=e.map((e=>e.name));e.sort(((e,t)=>e.arrivalTime-t.arrivalTime));let i=e[0].arrivalTime,r=[],l=[];for(l.push(e.shift());e.length>0||l.length>0;){let t=l[0],n=t.burstTime;if(t.execute(n,i),i+=n,e.length>0){let t=e.filter((e=>e.arrivalTime<=i));l=l.concat(t),e=e.filter((e=>e.arrivalTime>i))}l=l.filter((e=>!e.isDone||(r.push(e),!1))),l.sort(((e,t)=>ke(t,i)-ke(e,i)))}return r.sort(((e,t)=>n.indexOf(e.name)-n.indexOf(t.name))),r}function Fe(e,t,n){const i=e.slice();return i[4]=t[n],i[6]=n,i}function Le(t){let n,i,r,l,u,h,v,T,b=t[4].name+"",$=t[4].shorthand&&function(t){let n,i,r,l=t[4].shorthand+"";return{c(){n=m("b"),i=d(l),r=d(" -"),g(n,"class","svelte-1a8g062")},m(e,t){a(e,n,t),o(n,i),a(e,r,t)},p:e,d(e){e&&c(n),e&&c(r)}}}(t);function y(...e){return t[3](t[6],...e)}return{c(){n=m("li"),i=m("button"),$&&$.c(),r=f(),l=d(b),h=f(),i.disabled=t[4].disabled??!1,g(i,"class",u=s(t[0]===t[6]?"item selected":"item")+" svelte-1a8g062")},m(e,t){a(e,n,t),o(n,i),$&&$.m(i,null),o(i,r),o(i,l),o(n,h),v||(T=p(i,"click",y),v=!0)},p(e,n){(t=e)[4].shorthand&&$.p(t,n),1&n&&u!==(u=s(t[0]===t[6]?"item selected":"item")+" svelte-1a8g062")&&g(i,"class",u)},d(e){e&&c(n),$&&$.d(),v=!1,T()}}}function qe(t){let n,i,r=t[1],l=[];for(let e=0;e<r.length;e+=1)l[e]=Le(Fe(t,r,e));return{c(){n=m("div"),i=m("ul");for(let e=0;e<l.length;e+=1)l[e].c();g(i,"class","svelte-1a8g062"),g(n,"class","algo")},m(e,t){a(e,n,t),o(n,i);for(let e=0;e<l.length;e+=1)l[e].m(i,null)},p(e,[t]){if(7&t){let n;for(r=e[1],n=0;n<r.length;n+=1){const s=Fe(e,r,n);l[n]?l[n].p(s,t):(l[n]=Le(s),l[n].c(),l[n].m(i,null))}for(;n<l.length;n+=1)l[n].d(1);l.length=r.length}},i:e,o:e,d(e){e&&c(n),u(l,e)}}}function Re(e,t,n){const i=[{name:"Shortest Job First",shorthand:"SJF",scheduler:Ee},{name:"Shortest Remaining Time First",shorthand:"SRTF",scheduler:Ne},{name:"First-Come, First-Served",shorthand:"FCFS",scheduler:Me},{name:"Preemptive Priority Scheduling",scheduler:Se},{name:"Non-Preemptive Priority Scheduling",scheduler:He},{name:"Round-Robin ",shorthand:"RR",scheduler:Oe},{name:"Highest Response Ratio Next",shorthand:"HRRN",scheduler:Ae}];let r=0;const l=x();return[r,i,l,(e,t)=>{n(0,r=e),l("change",i[r].scheduler)}]}class Ce extends G{constructor(e){super(),B(this,e,Re,qe,l,{})}}function ze(t){let n,i,r,l,s,u,d;return{c(){n=m("div"),i=m("div"),r=m("div"),r.textContent="Quantum Time",l=f(),s=m("input"),g(r,"class","svelte-41teyp"),g(s,"type","number"),g(s,"min","1"),g(s,"id","quantumn-time"),g(s,"class","svelte-41teyp"),g(i,"class","settings svelte-41teyp")},m(e,c){a(e,n,c),o(n,i),o(i,r),o(i,l),o(i,s),b(s,t[0]),u||(d=p(s,"input",t[1]),u=!0)},p(e,[t]){1&t&&v(s.value)!==e[0]&&b(s,e[0])},i:e,o:e,d(e){e&&c(n),u=!1,d()}}}function De(e,t,n){let{quantumnTime:i}=t;return e.$$set=e=>{"quantumnTime"in e&&n(0,i=e.quantumnTime)},[i,function(){i=v(this.value),n(0,i)}]}class Ve extends G{constructor(e){super(),B(this,e,De,ze,l,{quantumnTime:0})}}const{window:je}=C;function Ie(t){let n,r,l,u,d,h,v,T,b,$,y,x,_,w,P,k,E,N,M,S,H;return{c(){n=m("div"),r=m("button"),r.innerHTML='<i class="fa-brands fa-github-alt"></i> \n        <p>Source</p>',l=f(),u=m("button"),u.innerHTML='<i class="fa-solid fa-heart"></i> \n        <p>Hảo tâm</p>',d=f(),h=m("div"),v=m("div"),T=m("p"),T.textContent="Hảo tâm",b=f(),$=m("button"),$.innerHTML='<i class="fa-solid fa-xmark"></i>',y=f(),x=m("div"),x.innerHTML='<div class="numbers svelte-1ixm21b"><b class="svelte-1ixm21b">Momo</b> \n                <p>0946 378 852</p></div> \n            <p>Văn Viết Hiếu Anh</p>',_=f(),w=m("button"),w.innerHTML='<i class="fa-solid fa-copy"></i>',P=f(),k=m("div"),k.innerHTML='<div class="numbers svelte-1ixm21b"><b class="svelte-1ixm21b">TP Bank</b> \n                <p>0323 731 6401</p></div> \n            <p>Văn Viết Hiếu Anh</p>',E=f(),N=m("button"),N.innerHTML='<i class="fa-solid fa-copy"></i>',g(r,"id","github"),g(r,"class","svelte-1ixm21b"),g(u,"id","donate"),g(u,"class","svelte-1ixm21b"),g(n,"class","main svelte-1ixm21b"),g(T,"id","title"),g(T,"class","svelte-1ixm21b"),g($,"id","close"),g($,"class","icon-button svelte-1ixm21b"),g(x,"class","momo method svelte-1ixm21b"),g(w,"class","icon-button svelte-1ixm21b"),g(k,"class","momo method svelte-1ixm21b"),g(N,"class","icon-button svelte-1ixm21b"),g(v,"class","donate-dialog svelte-1ixm21b"),g(h,"class",M=s(t[0]?"donate":"donate close")+" svelte-1ixm21b")},m(e,i){a(e,n,i),o(n,r),o(n,l),o(n,u),a(e,d,i),a(e,h,i),o(h,v),o(v,T),o(v,b),o(v,$),o(v,y),o(v,x),o(v,_),o(v,w),o(v,P),o(v,k),o(v,E),o(v,N),S||(H=[p(je,"keydown",t[1]),p(r,"click",t[2]),p(u,"click",t[3]),p($,"click",t[4]),p(w,"click",t[5]),p(N,"click",t[6])],S=!0)},p(e,[t]){1&t&&M!==(M=s(e[0]?"donate":"donate close")+" svelte-1ixm21b")&&g(h,"class",M)},i:e,o:e,d(e){e&&c(n),e&&c(d),e&&c(h),S=!1,i(H)}}}function Be(e){navigator.clipboard.writeText(e)}function Ge(e,t,n){let i=!1;return[i,e=>{"Escape"===e.key&&n(0,i=!1)},()=>window.open("https://github.com/vanviethieuanh/scheduling-algorithms"),()=>{n(0,i=!0)},()=>{n(0,i=!1)},()=>Be("0946378852"),()=>Be("03237316401")]}class Je extends G{constructor(e){super(),B(this,e,Ge,Ie,l,{})}}function Qe(e){let t,n,i,r,l,s,u,d,h,p,v,T,b,$,y,x,_,P,k,E;function N(t){e[8](t)}i=new we({props:{runs:e[4]}}),s=new Ce({}),s.$on("change",e[7]);let M={};function H(t){e[9](t)}void 0!==e[2]&&(M.quantumnTime=e[2]),p=new Ve({props:M}),w.push((()=>z(p,"quantumnTime",N)));let O={calculatedProcesses:e[3],columnsMapper:e[5]};return void 0!==e[0]&&(O.processes=e[0]),$=new he({props:O}),w.push((()=>z($,"processes",H))),$.$on("change",e[6]),_=new Je({}),{c(){t=m("main"),n=m("div"),D(i.$$.fragment),r=f(),l=m("div"),D(s.$$.fragment),u=f(),d=m("div"),h=f(),D(p.$$.fragment),T=f(),b=m("div"),D($.$$.fragment),x=f(),D(_.$$.fragment),P=f(),k=m("p"),k.innerHTML='Design and created by Văn Viết Hiếu Anh - All images from\n            <a href="https://unsplash.com/" target="_blank"><i class="fa-brands fa-unsplash"></i> Unsplash</a>',g(d,"class","divider"),g(l,"class","options"),g(b,"class","table"),g(k,"class","credit"),g(n,"class","container")},m(e,c){a(e,t,c),o(t,n),V(i,n,null),o(n,r),o(n,l),V(s,l,null),o(l,u),o(l,d),o(l,h),V(p,l,null),o(n,T),o(n,b),V($,b,null),o(n,x),V(_,n,null),o(n,P),o(n,k),E=!0},p(e,[t]){const n={};16&t&&(n.runs=e[4]),i.$set(n);const r={};!v&&4&t&&(v=!0,r.quantumnTime=e[2],S((()=>v=!1))),p.$set(r);const l={};8&t&&(l.calculatedProcesses=e[3]),!y&&1&t&&(y=!0,l.processes=e[0],S((()=>y=!1))),$.$set(l)},i(e){E||(q(i.$$.fragment,e),q(s.$$.fragment,e),q(p.$$.fragment,e),q($.$$.fragment,e),q(_.$$.fragment,e),E=!0)},o(e){R(i.$$.fragment,e),R(s.$$.fragment,e),R(p.$$.fragment,e),R($.$$.fragment,e),R(_.$$.fragment,e),E=!1},d(e){e&&c(t),j(i),j(s),j(p),j($),j(_)}}}function Ue(e,t,n){let i,r,l=[new Q("P-1",0,12,2),new Q("P-2",2,7,1),new Q("P-3",5,8,5),new Q("P-4",9,3,4),new Q("P-5",12,6,3)];let s=Ee,o=4;return e.$$.update=()=>{7&e.$$.dirty&&n(3,i=s(l.slice(),{quantumnTime:o})),8&e.$$.dirty&&n(4,r=i.map((e=>e.toGranttPeriods())).flat())},[l,s,o,i,r,[{title:"Name",dataType:"text",getter:e=>e.name,setter:(e,t)=>{e.name=t},editable:!0},{title:"Arrival Time",dataType:"number",getter:e=>e.arrivalTime,setter:(e,t)=>{e.arrivalTime=t},min:0,editable:!0},{title:"Burst Time",dataType:"number",getter:e=>e.burstTime,setter:(e,t)=>{e.burstTime=t},min:1,editable:!0},{title:"Priority",dataType:"number",getter:e=>e.priority?e.priority:"0",setter:(e,t)=>{e.priority=t},editable:!0},{title:"Finish Time",dataType:"number",getter:e=>e.finishedTime,setter:(e,t)=>{throw"Not Implemented"},copyable:!0,avg:!0},{title:"Wait Time",dataType:"text",getter:e=>e.waitTime,setter:(e,t)=>{throw"Not Implemented"},copyable:!0,avg:!0},{title:"Turnaround Time",dataType:"text",getter:e=>e.turnaroundTime,setter:(e,t)=>{throw"Not Implemented"},copyable:!0,avg:!0},{title:"Response Time",dataType:"text",getter:e=>e.responseTime,setter:(e,t)=>{throw"Not Implemented"},copyable:!0,avg:!0}],function(e){n(0,l=e.detail.data)},({detail:e})=>{n(1,s=e)},function(e){o=e,n(2,o)},function(e){l=e,n(0,l)}]}return new class extends G{constructor(e){super(),B(this,e,Ue,Qe,l,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map