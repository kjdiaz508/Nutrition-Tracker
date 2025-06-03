(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var Z,Ge;class pt extends Error{}pt.prototype.name="InvalidTokenError";function _r(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function $r(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return _r(t)}catch{return atob(t)}}function ks(i,t){if(typeof i!="string")throw new pt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new pt(`Invalid token specified: missing part #${e+1}`);let s;try{s=$r(r)}catch(n){throw new pt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new pt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const br="mu:context",he=`${br}:change`;class wr{constructor(t,e){this._proxy=Ar(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Cs extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new wr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(he,t),t}detach(t){this.removeEventListener(he,t)}}function Ar(i,t){return new Proxy(i,{get:(r,s,n)=>{if(s==="then")return;const o=Reflect.get(r,s,n);return console.log(`Context['${s}'] => `,o),o},set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(he,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function Er(i,t){const e=Os(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function Os(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return Os(i,s.host)}class Sr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ts(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Sr(e,i))}class _e{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function xr(i){return t=>({...t,...i})}const ue="mu:auth:jwt",Rs=class Ns extends _e{constructor(t,e){super((r,s)=>this.update(r,s),t,Ns.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(kr(r)),ie(s);case"auth/signout":return e(Cr()),ie(this._redirectForLogin);case"auth/redirect":return ie(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Rs.EVENT_TYPE="auth:message";let Us=Rs;const Ms=Ts(Us.EVENT_TYPE);function ie(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,n])=>r.searchParams.set(s,n)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class Pr extends Cs{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=et.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Us(this.context,this.redirect).attach(this)}}class gt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ue),t}}class et extends gt{constructor(t){super();const e=ks(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new et(t);return localStorage.setItem(ue,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ue);return t?et.authenticate(t):new gt}}function kr(i){return xr({user:et.authenticate(i),token:i})}function Cr(){return i=>{const t=i.user;return{user:t&&t.authenticated?gt.deauthenticate(t):t,token:""}}}function Or(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Tr(i){return i.authenticated?ks(i.token||""):{}}const Rr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:et,Provider:Pr,User:gt,dispatch:Ms,headers:Or,payload:Tr},Symbol.toStringTag,{value:"Module"}));function Mt(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function pe(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}const Nr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:pe,relay:Mt},Symbol.toStringTag,{value:"Module"}));function Ls(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const Ur=new DOMParser;function q(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const m=e[d-1];return m instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[m,a]}).flat().join(""),s=Ur.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const m=o.querySelector(`ins#mu-html-${d}`);if(m){const p=m.parentNode;p==null||p.replaceChild(a,m)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ts(a);case"bigint":case"boolean":case"number":case"symbol":return ts(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const m=new DocumentFragment,p=a.map(l);return m.replaceChildren(...p),m}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ts(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Jt(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}Z=class extends HTMLElement{constructor(){super(),this._state={},Jt(this).template(Z.template).styles(Z.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Mt(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},Mr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},Z.template=q`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Z.styles=Ls`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function Mr(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return i}const js=class Is extends _e{constructor(t){super((e,r)=>this.update(e,r),t,Is.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(jr(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(Ir(r,s));break}}}};js.EVENT_TYPE="history:message";let $e=js;class es extends Cs{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Lr(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),be(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new $e(this.context).attach(this)}}function Lr(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function jr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Ir(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const be=Ts($e.EVENT_TYPE),zr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:es,Provider:es,Service:$e,dispatch:be},Symbol.toStringTag,{value:"Module"}));class k{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new ss(this._provider,t);this._effects.push(s),e(s)}else Er(this._target,this._contextLabel).then(s=>{const n=new ss(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ss{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const zs=class Hs extends HTMLElement{constructor(){super(),this._state={},this._user=new gt,this._authObserver=new k(this,"blazing:auth"),Jt(this).template(Hs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Hr(s,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&rs(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&rs(this.src,this.authorization).then(s=>{this._state=s,lt(s,this)});break;case"new":r&&(this._state={},lt({},this));break}}};zs.observedAttributes=["src","new","action"];zs.template=q`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function rs(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function lt(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function Hr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const Dr=class Ds extends _e{constructor(t,e){super(e,t,Ds.EVENT_TYPE,!1)}};Dr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,we=Nt.ShadowRoot&&(Nt.ShadyCSS===void 0||Nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ae=Symbol(),is=new WeakMap;let Bs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=is.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&is.set(e,t))}return t}toString(){return this.cssText}};const Br=i=>new Bs(typeof i=="string"?i:i+"",void 0,Ae),qr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Bs(e,i,Ae)},Fr=(i,t)=>{if(we)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Nt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},ns=we?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Br(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Vr,defineProperty:Wr,getOwnPropertyDescriptor:Yr,getOwnPropertyNames:Kr,getOwnPropertySymbols:Jr,getPrototypeOf:Zr}=Object,st=globalThis,os=st.trustedTypes,Qr=os?os.emptyScript:"",as=st.reactiveElementPolyfillSupport,dt=(i,t)=>i,Lt={toAttribute(i,t){switch(t){case Boolean:i=i?Qr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ee=(i,t)=>!Vr(i,t),ls={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Ee};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),st.litPropertyMetadata??(st.litPropertyMetadata=new WeakMap);let X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ls){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Wr(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Yr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ls}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=Zr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,r=[...Kr(e),...Jr(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(ns(s))}else t!==void 0&&e.push(ns(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Lt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Lt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??Ee)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[dt("elementProperties")]=new Map,X[dt("finalized")]=new Map,as==null||as({ReactiveElement:X}),(st.reactiveElementVersions??(st.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=globalThis,It=jt.trustedTypes,cs=It?It.createPolicy("lit-html",{createHTML:i=>i}):void 0,qs="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,Fs="?"+R,Xr=`<${Fs}>`,V=document,vt=()=>V.createComment(""),yt=i=>i===null||typeof i!="object"&&typeof i!="function",Se=Array.isArray,Gr=i=>Se(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ne=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,hs=/-->/g,us=/>/g,z=RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ps=/'/g,ds=/"/g,Vs=/^(?:script|style|textarea|title)$/i,ti=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ht=ti(1),rt=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),fs=new WeakMap,D=V.createTreeWalker(V,129);function Ws(i,t){if(!Se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return cs!==void 0?cs.createHTML(t):t}const ei=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=i[l];let d,m,p=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===ct?m[1]==="!--"?o=hs:m[1]!==void 0?o=us:m[2]!==void 0?(Vs.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=z):m[3]!==void 0&&(o=z):o===z?m[0]===">"?(o=s??ct,p=-1):m[1]===void 0?p=-2:(p=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?z:m[3]==='"'?ds:ps):o===ds||o===ps?o=z:o===hs||o===us?o=ct:(o=z,s=void 0);const u=o===z&&i[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Xr:p>=0?(r.push(d),a.slice(0,p)+qs+a.slice(p)+R+u):a+R+(p===-2?l:u)}return[Ws(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let de=class Ys{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=ei(t,e);if(this.el=Ys.createElement(d,r),D.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=D.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(qs)){const c=m[o++],u=s.getAttribute(p).split(R),f=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:f[2],strings:u,ctor:f[1]==="."?ri:f[1]==="?"?ii:f[1]==="@"?ni:Zt}),s.removeAttribute(p)}else p.startsWith(R)&&(a.push({type:6,index:n}),s.removeAttribute(p));if(Vs.test(s.tagName)){const p=s.textContent.split(R),c=p.length-1;if(c>0){s.textContent=It?It.emptyScript:"";for(let u=0;u<c;u++)s.append(p[u],vt()),D.nextNode(),a.push({type:2,index:++n});s.append(p[c],vt())}}}else if(s.nodeType===8)if(s.data===Fs)a.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(R,p+1))!==-1;)a.push({type:7,index:n}),p+=R.length-1}n++}}static createElement(t,e){const r=V.createElement("template");return r.innerHTML=t,r}};function it(i,t,e=i,r){var s,n;if(t===rt)return t;let o=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=yt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=o:e.l=o),o!==void 0&&(t=it(i,o._$AS(i,t.values),o,r)),t}class si{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??V).importNode(e,!0);D.currentNode=s;let n=D.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new xt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new oi(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=V,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class xt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),yt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Gr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=de.createElement(Ws(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new si(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=fs.get(t.strings);return e===void 0&&fs.set(t.strings,e=new de(t)),e}k(t){Se(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new xt(this.O(vt()),this.O(vt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=w}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==rt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,l[r+a],e,a),d===rt&&(d=this._$AH[a]),o||(o=!yt(d)||d!==this._$AH[a]),d===w?t=w:t!==w&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ri extends Zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class ii extends Zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class ni extends Zt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??w)===rt)return;const r=this._$AH,s=t===w&&r!==w||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==w&&(r===w||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class oi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}}const ms=jt.litHtmlPolyfillSupport;ms==null||ms(de,xt),(jt.litHtmlVersions??(jt.litHtmlVersions=[])).push("3.2.0");const ai=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new xt(t.insertBefore(vt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let tt=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=ai(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return rt}};tt._$litElement$=!0,tt.finalized=!0,(Ge=globalThis.litElementHydrateSupport)==null||Ge.call(globalThis,{LitElement:tt});const gs=globalThis.litElementPolyfillSupport;gs==null||gs({LitElement:tt});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const li={attribute:!0,type:String,converter:Lt,reflect:!1,hasChanged:Ee},ci=(i=li,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function Ks(i){return(t,e)=>typeof e=="object"?ci(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Js(i){return Ks({...i,state:!0,attribute:!1})}function hi(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function ui(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Zs={};(function(i){var t=function(){var e=function(p,c,u,f){for(u=u||{},f=p.length;f--;u[p[f]]=c);return u},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,u,f,v,g,y,Gt){var C=y.length-1;switch(g){case 1:return new v.Root({},[y[C-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[y[C-1],y[C]]);break;case 4:case 5:this.$=y[C];break;case 6:this.$=new v.Literal({value:y[C]});break;case 7:this.$=new v.Splat({name:y[C]});break;case 8:this.$=new v.Param({name:y[C]});break;case 9:this.$=new v.Optional({},[y[C-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,u){if(u.recoverable)this.trace(c);else{let f=function(v,g){this.message=v,this.hash=g};throw f.prototype=Error,new f(c,u)}},parse:function(c){var u=this,f=[0],v=[null],g=[],y=this.table,Gt="",C=0,Ze=0,mr=2,Qe=1,gr=g.slice.call(arguments,1),b=Object.create(this.lexer),j={yy:{}};for(var te in this.yy)Object.prototype.hasOwnProperty.call(this.yy,te)&&(j.yy[te]=this.yy[te]);b.setInput(c,j.yy),j.yy.lexer=b,j.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var ee=b.yylloc;g.push(ee);var vr=b.options&&b.options.ranges;typeof j.yy.parseError=="function"?this.parseError=j.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var yr=function(){var J;return J=b.lex()||Qe,typeof J!="number"&&(J=u.symbols_[J]||J),J},P,I,O,se,K={},Tt,T,Xe,Rt;;){if(I=f[f.length-1],this.defaultActions[I]?O=this.defaultActions[I]:((P===null||typeof P>"u")&&(P=yr()),O=y[I]&&y[I][P]),typeof O>"u"||!O.length||!O[0]){var re="";Rt=[];for(Tt in y[I])this.terminals_[Tt]&&Tt>mr&&Rt.push("'"+this.terminals_[Tt]+"'");b.showPosition?re="Parse error on line "+(C+1)+`:
`+b.showPosition()+`
Expecting `+Rt.join(", ")+", got '"+(this.terminals_[P]||P)+"'":re="Parse error on line "+(C+1)+": Unexpected "+(P==Qe?"end of input":"'"+(this.terminals_[P]||P)+"'"),this.parseError(re,{text:b.match,token:this.terminals_[P]||P,line:b.yylineno,loc:ee,expected:Rt})}if(O[0]instanceof Array&&O.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+P);switch(O[0]){case 1:f.push(P),v.push(b.yytext),g.push(b.yylloc),f.push(O[1]),P=null,Ze=b.yyleng,Gt=b.yytext,C=b.yylineno,ee=b.yylloc;break;case 2:if(T=this.productions_[O[1]][1],K.$=v[v.length-T],K._$={first_line:g[g.length-(T||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(T||1)].first_column,last_column:g[g.length-1].last_column},vr&&(K._$.range=[g[g.length-(T||1)].range[0],g[g.length-1].range[1]]),se=this.performAction.apply(K,[Gt,Ze,C,j.yy,O[1],v,g].concat(gr)),typeof se<"u")return se;T&&(f=f.slice(0,-1*T*2),v=v.slice(0,-1*T),g=g.slice(0,-1*T)),f.push(this.productions_[O[1]][0]),v.push(K.$),g.push(K._$),Xe=y[f[f.length-2]][f[f.length-1]],f.push(Xe);break;case 3:return!0}}return!0}},d=function(){var p={EOF:1,parseError:function(u,f){if(this.yy.parser)this.yy.parser.parseError(u,f);else throw new Error(u)},setInput:function(c,u){return this.yy=u||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var u=c.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var u=c.length,f=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===v.length?this.yylloc.first_column:0)+v[v.length-f.length].length-f[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),u=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+u+"^"},test_match:function(c,u){var f,v,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),v=c[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],f=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,u,f,v;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(f=this._input.match(this.rules[g[y]]),f&&(!u||f[0].length>u[0].length)){if(u=f,v=y,this.options.backtrack_lexer){if(c=this.test_match(f,g[y]),c!==!1)return c;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(c=this.test_match(u,g[v]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(u,f,v,g){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return p}();a.lexer=d;function m(){this.yy={}}return m.prototype=a,a.Parser=m,new m}();typeof ui<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Zs);function Q(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Qs={Root:Q("Root"),Concat:Q("Concat"),Literal:Q("Literal"),Splat:Q("Splat"),Param:Q("Param"),Optional:Q("Optional")},Xs=Zs.parser;Xs.yy=Qs;var pi=Xs,di=Object.keys(Qs);function fi(i){return di.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Gs=fi,mi=Gs,gi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function tr(i){this.captures=i.captures,this.re=i.re}tr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var vi=mi({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(gi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new tr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),yi=vi,_i=Gs,$i=_i({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),bi=$i,wi=pi,Ai=yi,Ei=bi;Pt.prototype=Object.create(null);Pt.prototype.match=function(i){var t=Ai.visit(this.ast),e=t.match(i);return e||!1};Pt.prototype.reverse=function(i){return Ei.visit(this.ast,i)};function Pt(i){var t;if(this?t=this:t=Object.create(Pt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=wi.parse(i),t}var Si=Pt,xi=Si,Pi=xi;const ki=hi(Pi);var Ci=Object.defineProperty,er=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ci(t,e,s),s};const sr=class extends tt{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>ht` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new ki(s.path)})),this._historyObserver=new k(this,e),this._authObserver=new k(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Ms(this,"auth/redirect"),ht` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ht` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),ht` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){be(this,"history/redirect",{href:t})}};sr.styles=qr`
    :host,
    main {
      display: contents;
    }
  `;let zt=sr;er([Js()],zt.prototype,"_user");er([Js()],zt.prototype,"_match");const Oi=Object.freeze(Object.defineProperty({__proto__:null,Element:zt,Switch:zt},Symbol.toStringTag,{value:"Module"})),Ti=class rr extends HTMLElement{constructor(){if(super(),Jt(this).template(rr.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ti.template=q`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const ir=class fe extends HTMLElement{constructor(){super(),this._array=[],Jt(this).template(fe.template).styles(fe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(nr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{pe(t,"button.add")?Mt(t,"input-array:add"):pe(t,"button.remove")&&Mt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};ir.template=q`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ir.styles=Ls`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function Ri(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(nr(e)))}function nr(i,t){const e=i===void 0?q`<input />`:q`<input value="${i}" />`;return q`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Ni(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ui=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,Li=(i,t,e,r)=>{for(var s=Mi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ui(t,e,s),s};class ji extends tt{constructor(t){super(),this._pending=[],this._observer=new k(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}Li([Ks()],ji.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,xe=Ut.ShadowRoot&&(Ut.ShadyCSS===void 0||Ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),vs=new WeakMap;let or=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(xe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=vs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&vs.set(e,t))}return t}toString(){return this.cssText}};const Ii=i=>new or(typeof i=="string"?i:i+"",void 0,Pe),E=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new or(e,i,Pe)},zi=(i,t)=>{if(xe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Ut.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},ys=xe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Ii(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Hi,defineProperty:Di,getOwnPropertyDescriptor:Bi,getOwnPropertyNames:qi,getOwnPropertySymbols:Fi,getPrototypeOf:Vi}=Object,U=globalThis,_s=U.trustedTypes,Wi=_s?_s.emptyScript:"",oe=U.reactiveElementPolyfillSupport,ft=(i,t)=>i,Ht={toAttribute(i,t){switch(t){case Boolean:i=i?Wi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ke=(i,t)=>!Hi(i,t),$s={attribute:!0,type:String,converter:Ht,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),U.litPropertyMetadata??(U.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$s){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Di(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=Bi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$s}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Vi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,r=[...qi(e),...Fi(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(ys(s))}else t!==void 0&&e.push(ys(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Ht).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=r.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Ht;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??ke)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ft("elementProperties")]=new Map,G[ft("finalized")]=new Map,oe==null||oe({ReactiveElement:G}),(U.reactiveElementVersions??(U.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Dt=mt.trustedTypes,bs=Dt?Dt.createPolicy("lit-html",{createHTML:i=>i}):void 0,ar="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,lr="?"+N,Yi=`<${lr}>`,W=document,_t=()=>W.createComment(""),$t=i=>i===null||typeof i!="object"&&typeof i!="function",Ce=Array.isArray,Ki=i=>Ce(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ae=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=/-->/g,As=/>/g,H=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Es=/'/g,Ss=/"/g,cr=/^(?:script|style|textarea|title)$/i,Ji=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),h=Ji(1),nt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),xs=new WeakMap,B=W.createTreeWalker(W,129);function hr(i,t){if(!Ce(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return bs!==void 0?bs.createHTML(t):t}const Zi=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<e;l++){const a=i[l];let d,m,p=-1,c=0;for(;c<a.length&&(o.lastIndex=c,m=o.exec(a),m!==null);)c=o.lastIndex,o===ut?m[1]==="!--"?o=ws:m[1]!==void 0?o=As:m[2]!==void 0?(cr.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=H):m[3]!==void 0&&(o=H):o===H?m[0]===">"?(o=s??ut,p=-1):m[1]===void 0?p=-2:(p=o.lastIndex-m[2].length,d=m[1],o=m[3]===void 0?H:m[3]==='"'?Ss:Es):o===Ss||o===Es?o=H:o===ws||o===As?o=ut:(o=H,s=void 0);const u=o===H&&i[l+1].startsWith("/>")?" ":"";n+=o===ut?a+Yi:p>=0?(r.push(d),a.slice(0,p)+ar+a.slice(p)+N+u):a+N+(p===-2?l:u)}return[hr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class bt{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,m]=Zi(t,e);if(this.el=bt.createElement(d,r),B.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=B.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(ar)){const c=m[o++],u=s.getAttribute(p).split(N),f=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:f[2],strings:u,ctor:f[1]==="."?Xi:f[1]==="?"?Gi:f[1]==="@"?tn:Qt}),s.removeAttribute(p)}else p.startsWith(N)&&(a.push({type:6,index:n}),s.removeAttribute(p));if(cr.test(s.tagName)){const p=s.textContent.split(N),c=p.length-1;if(c>0){s.textContent=Dt?Dt.emptyScript:"";for(let u=0;u<c;u++)s.append(p[u],_t()),B.nextNode(),a.push({type:2,index:++n});s.append(p[c],_t())}}}else if(s.nodeType===8)if(s.data===lr)a.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(N,p+1))!==-1;)a.push({type:7,index:n}),p+=N.length-1}n++}}static createElement(t,e){const r=W.createElement("template");return r.innerHTML=t,r}}function ot(i,t,e=i,r){var o,l;if(t===nt)return t;let s=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl;const n=$t(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=ot(i,s._$AS(i,t.values),s,r)),t}class Qi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??W).importNode(e,!0);B.currentNode=s;let n=B.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new kt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new en(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=B.nextNode(),o++)}return B.currentNode=W,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class kt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ot(this,t,e),$t(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==nt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ki(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(W.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=bt.createElement(hr(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new Qi(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=xs.get(t.strings);return e===void 0&&xs.set(t.strings,e=new bt(t)),e}k(t){Ce(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new kt(this.O(_t()),this.O(_t()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=A}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=ot(this,t,e,0),o=!$t(t)||t!==this._$AH&&t!==nt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ot(this,l[r+a],e,a),d===nt&&(d=this._$AH[a]),o||(o=!$t(d)||d!==this._$AH[a]),d===A?t=A:t!==A&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Xi extends Qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class Gi extends Qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class tn extends Qt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=ot(this,t,e,0)??A)===nt)return;const r=this._$AH,s=t===A&&r!==A||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==A&&(r===A||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class en{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}}const le=mt.litHtmlPolyfillSupport;le==null||le(bt,kt),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.0");const sn=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new kt(t.insertBefore(_t(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=globalThis;class _ extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=sn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return nt}}var Ps;_._$litElement$=!0,_.finalized=!0,(Ps=F.litElementHydrateSupport)==null||Ps.call(F,{LitElement:_});const ce=F.litElementPolyfillSupport;ce==null||ce({LitElement:_});(F.litElementVersions??(F.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rn={attribute:!0,type:String,converter:Ht,reflect:!1,hasChanged:ke},nn=(i=rn,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function S(i){return(t,e)=>typeof e=="object"?nn(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(i){return S({...i,state:!0,attribute:!1})}const on=E`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }

  svg.icon,
  svg.icon-no-fill {
    display: inline;
    height: 2em;
    width: 2em;
    vertical-align: top;
  }
  svg.icon {
    fill: currentColor;
  }

  mpn-card h2 {
    margin-bottom: var(--space-sm);
    color: var(--color-accent);
    font-family: var(--font-family-heading);
  }

  mpn-card p,
  mpn-card ul,
  mpn-card ol {
    margin-bottom: var(--space-sm);
  }
`,$={styles:on};var an=Object.defineProperty,Ct=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&an(t,e,s),s};const Te=class Te extends _{constructor(){super(...arguments),this.title="",this.label="Back",this.hideBack=!1,this._authObserver=new k(this,"mpn:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback();const t=localStorage.getItem("dark-mode")==="true";document.body.classList.toggle("dark-mode",t),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector('input[type="checkbox"]');e&&(e.checked=t)}),this._authObserver.observe(e=>{const{user:r}=e;console.log("user: ",r),r&&r.authenticated?(console.log("authenticated"),this.loggedIn=!0,this.userid=r.username):(this.loggedIn=!1,this.userid=void 0)})}renderProfileButton(){return h`
      <mpn-button-link href="/app/profile" class="button-link">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        My Profile
      </mpn-button-link>
    `}renderSignInButton(){return h`
      <mpn-button-link href="/app/login">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        Sign In
      </mpn-button-link>
    `}renderNavButtons(){return h`
      <nav>
        <ul class="row">
          ${this.hideBack?h`<li>
            ${this.loggedIn?this.renderProfileButton():this.renderSignInButton()}
          </li>`:h`<li>${this.renderBackButton()}</li>`}
          <li>
            <mpn-button-link href="/app/discover/recipes">
              <svg class="icon">
                <use href="/icons/nutrition.svg#icon-cookbook" />
              </svg>
              Browse Shared Recipes
            </mpn-button-link>
          </li>
          <li>
            <mpn-button-link href="/app/discover/plans">
              <svg class="icon">
                <use href="/icons/nutrition.svg#icon-meal-plan" />
              </svg>
              Browse Shared Meal Plans
            </mpn-button-link>
          </li>
        </ul>
      </nav>
    `}renderBackButton(){return h`
      <nav>
        <button class="button-link" @click=${()=>history.back()}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-back">
        </svg>
          ${this.label}
        </button>
      </nav>
    `}toggleTheme(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e),localStorage.setItem("dark-mode",String(e))}render(){return console.log("logged in: ",this.loggedIn),h`
      <header>
        <div class="row">
          <h1>${this.title}</h1>
          <label id="themeToggle">
            <input
              type="checkbox"
              @change=${this.toggleTheme}
              aria-label="dark mode"
            />
            Dark Mode
          </label>
        </div>
        ${this.renderNavButtons()}
      </header>
    `}};Te.styles=[$.styles,E`
      header {
        background-color: var(--color-background-header);
        color: var(--color-text-inverted);
        padding: 1rem;
        border-bottom: 2px solid var(--color-accent);
        font-family: var(--font-family-heading);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }
      button {
        font: inherit;
      }
      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      button:hover {
        background-color: #c75c1d;
      }
      nav {
        width: 100%;
      }
      h1 {
        color: var(--color-accent);
        font-family: var(--font-family-heading);
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
      }
    `];let M=Te;Ct([S()],M.prototype,"title");Ct([S()],M.prototype,"label");Ct([S({type:Boolean})],M.prototype,"hideBack");Ct([x()],M.prototype,"loggedIn");Ct([x()],M.prototype,"userid");const Re=class Re extends _{render(){return h`<slot></slot>`}};Re.styles=[$.styles,E`
      :host {
        display: block;
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `];let me=Re;const Ne=class Ne extends _{render(){return h`
      <main>
        <slot></slot>
      </main>
    `}};Ne.styles=[$.styles,E`
      main {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-md);
        padding: var(--space-lg) var(--space-md);
      }

      ::slotted(.col-span-12) {
        grid-column: span 12;
      }
      ::slotted(.col-span-8) {
        grid-column: span 8;
      }
      ::slotted(.col-span-6) {
        grid-column: span 6;
      }
      ::slotted(.col-span-4) {
        grid-column: span 4;
      }
      ::slotted(.col-span-3) {
        grid-column: span 3;
      }

      @media (max-width: 768px) {
        main {
          grid-template-columns: repeat(8, 1fr);
        }
        ::slotted(.col-span-6),
        ::slotted(.col-span-4),
        ::slotted(.col-span-3),
        ::slotted(.col-span-8),
        ::slotted(.col-span-12) {
          grid-column: span 8;
        }
      }
    `];let ge=Ne;var ln=Object.defineProperty,Oe=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ln(t,e,s),s};const Ue=class Ue extends _{constructor(){super(...arguments),this.todayRecipes=[],this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;(e=t.user)!=null&&e.authenticated&&(this._user=t.user,this.hydrate())})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){var t;try{const r=await(await fetch(`/api/users/username/${this._user.username}`,{headers:this.authorization})).json();this.user=r,this.mealPlan=r.currentMealPlan;const s=new Date().toLocaleDateString("en-US",{weekday:"long"}),n=(t=this.mealPlan)==null?void 0:t.days.find(o=>o.weekday.toLowerCase()===s.toLowerCase());this.todayRecipes=(n==null?void 0:n.recipes)||[]}catch(e){console.error("Error fetching current user or meal plan:",e)}}renderToday(){return this.todayRecipes.length?h`
      <ul>
        ${this.todayRecipes.map(t=>h`
            <li>
              <a href="/app/my-recipes/${t._id}">${t.name}</a>
            </li>
          `)}
      </ul>
    `:h`<p>No meals planned for today.</p>`}render(){return h`
      <mpn-header title="Meal Prep & Nutrition Organizer" hideBack></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Welcome!</h2>
          <p>
            Use this app to explore meal plans, view detailed nutrition info,
            and prep your week efficiently.
          </p>
        </mpn-card>

        ${this.mealPlan?h`
              <mpn-card class="col-span-12">
                <h3>Current Meal Plan:</h3>
                <p>
                  <a href="/app/my-plans/${this.mealPlan._id}">
                    ${this.mealPlan.name}
                  </a>
                </p>
              </mpn-card>

              <mpn-card class="col-span-12">
                <h3>Today's Meals (${new Date().toLocaleDateString(void 0,{weekday:"long"})}):</h3>
                ${this.renderToday()}
              </mpn-card>
            `:h`
              <mpn-card class="col-span-12">
                <p>You don't have a current meal plan set.</p>
                <p>
                  <a href="/app/my-plans">Choose one from your plans</a>
                  or
                  <a href="/app/discover/plans">browse public plans</a>.
                </p>
              </mpn-card>
            `}
      </mpn-main-grid>
    `}};Ue.styles=[$.styles,E`
      h3 {
        margin-bottom: var(--space-sm);
      }

      ul {
        padding-left: 1rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `];let at=Ue;Oe([x()],at.prototype,"user");Oe([x()],at.prototype,"mealPlan");Oe([x()],at.prototype,"todayRecipes");var cn=Object.defineProperty,hn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&cn(t,e,s),s};const Me=class Me extends _{constructor(){super(...arguments),this.href=""}render(){return h`
      <a href=${this.href}>
        <slot></slot>
      </a>
    `}};Me.styles=[$.styles,E`
      a {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      a:hover {
        background-color: #c75c1d;
      }
    `];let Bt=Me;hn([S()],Bt.prototype,"href");const Le=class Le extends _{render(){return h`
      <mpn-header title="Log In or Sign Up"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12 center-content">
            <div class="sequence">
              <h2>Login</h2>
              <login-form api="/auth/login" redirect="/">
                <label>
                  <span>Username:</span>
                  <input name="username" autocomplete="off" />
                </label>
                <label>
                  <span>Password:</span>
                  <input type="password" name="password" />
                </label>
              </login-form>
            </div>
        </mpn-card>
        <div class="col-span-12">
          <p>
            Or did you want to
            <mpn-button-link href="/app/sign-up">
              Sign up as a new user
            </mpn-button-link>?
          </p>
        </div>
      </mpn-main-grid>
    `}};Le.styles=[$.styles,E`
      mpn-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
      }

    `];let ve=Le;var un=Object.defineProperty,Xt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&un(t,e,s),s};const je=class je extends _{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return h`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,r=e==null?void 0:e.name,s=e==null?void 0:e.value,n=this.formData;switch(r){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(({token:e})=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{console.error(e),this.error=e.toString()})}};je.styles=[$.styles,E`
      :host {
        margin-top: var(--space-md);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      label {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        font-weight: bold;
      }

      input {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      button {
        align-self: flex-start;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error:not(:empty) {
        color: var(--color-error, red);
        border: 1px solid var(--color-error, red);
        padding: var(--space-sm);
        background: #ffe5e5;
        border-radius: 6px;
      }
    `];let Y=je;Xt([x()],Y.prototype,"formData");Xt([S()],Y.prototype,"api");Xt([S()],Y.prototype,"redirect");Xt([x()],Y.prototype,"error");var pn=Object.defineProperty,ur=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&pn(t,e,s),s};const Ie=class Ie extends _{constructor(){super(...arguments),this.id="",this._authObserver=new k(this,"mpn:auth")}get src(){return`/api/mealplans/${this.id}`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{this.mealPlan=e}).catch(e=>console.error("Error fetching meal plan:",e))}render(){var t;return h`
      <mpn-header title=${(t=this.mealPlan)==null?void 0:t.name}></mpn-header>

      <mpn-main-grid>
        <section class="col-span-12">
          <mpn-meal-plan .mealPlan=${this.mealPlan}></mpn-meal-plan>
        </section>
      </mpn-main-grid>
    `}};Ie.styles=[$.styles];let wt=Ie;ur([S({type:String})],wt.prototype,"id");ur([x()],wt.prototype,"mealPlan");var dn=Object.defineProperty,fn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&dn(t,e,s),s};const ze=class ze extends _{computeNutrition(t){const e={calories:0,protein:0,carbs:0,fat:0};for(const r of t)for(const s of r.ingredients)e.calories+=s.calories||0,e.protein+=s.protein||0,e.carbs+=s.carbs||0,e.fat+=s.fat||0;return{calories:Math.round(e.calories).toString(),protein:Math.round(e.protein).toString(),carbs:Math.round(e.carbs).toString(),fat:Math.round(e.fat).toString()}}render(){return this.mealPlan?h`
      <section>
        ${this.mealPlan.days.map(t=>{const e=this.computeNutrition(t.recipes);return h`
            <mpn-meal-day
              day=${t.weekday}
              calories=${e.calories}
              protein=${e.protein}
              carbs=${e.carbs}
              fat=${e.fat}
            >
              ${t.recipes.map(r=>h`
                  <mpn-recipe-link
                    href="/app/discover/recipes/${r._id}"
                    title=${r.name}
                  ></mpn-recipe-link>
                `)}
            </mpn-meal-day>
          `})}
      </section>
    `:h`<p>Loading meal plan...</p>`}};ze.styles=[$.styles];let qt=ze;fn([S()],qt.prototype,"mealPlan");var mn=Object.defineProperty,Ot=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&mn(t,e,s),s};const He=class He extends _{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return h`
      <section>
        <h2>${this.day}</h2>
        <div>
          <slot></slot>
        </div>
        <p>
          Calories: ${this.calories} |
          Protein: ${this.protein} |
          Carbs: ${this.carbs} |
          Fat: ${this.fat}
        </p>
      </section>
    `}};He.styles=[$.styles,E`
      section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        background-color: var(--color-background-card);
        border-radius: 8px;
        padding: var(--space-md);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-xs);
      }

      div {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      p {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
    `];let L=He;Ot([S()],L.prototype,"day");Ot([S()],L.prototype,"calories");Ot([S()],L.prototype,"protein");Ot([S()],L.prototype,"carbs");Ot([S()],L.prototype,"fat");var gn=Object.defineProperty,pr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&gn(t,e,s),s};const De=class De extends _{constructor(){super(...arguments),this.href="",this.title=""}render(){return h`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `}};De.styles=[$.styles,E`
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--color-text-primary);
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      svg.icon {
        fill: var(--color-accent);
      }
    `];let At=De;pr([S()],At.prototype,"href");pr([S()],At.prototype,"title");var vn=Object.defineProperty,yn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&vn(t,e,s),s};const Be=class Be extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/mealplans/public",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.mealPlans=t}).catch(t=>console.error("Error fetching meal plan:",t))}renderPlanList(){var t;return this.mealPlans?h`
      <ul>
        ${(t=this.mealPlans)==null?void 0:t.map(e=>h`
            <li>
              <mpn-card>
                <a href="/app/discover/plans/${e._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-meal-plan"></use>
                  </svg>
                  ${e.name}
                </a>
              </mpn-card>
            </li>
          `)}
      </ul>
    `:h`Loading meal plans...`}render(){return h`
      <mpn-header
          title="Public Meal Plan Library"
      ></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>
    `}};Be.styles=[$.styles,E`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Ft=Be;yn([x()],Ft.prototype,"mealPlans");var _n=Object.defineProperty,$n=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&_n(t,e,s),s};const qe=class qe extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;(e=t.user)!=null&&e.authenticated&&(this._user=t.user,this.hydrate())})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){try{const e=await(await fetch(`/api/users/username/${this._user.username}`,{headers:this.authorization})).json();console.log("bleh:",e),this.user=e}catch(t){console.error("Failed to fetch profile:",t)}}async setAsCurrent(t){if(!this.user||!confirm("Set this meal plan as your current one?"))return;const r={...this.user,currentMealPlan:t};try{const s=await fetch(`/api/users/${this.user._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...this.authorization},body:JSON.stringify(r)});if(!s.ok)throw new Error("Failed to update user");const n=await s.json();this.user=n}catch(s){console.error("Error setting current meal plan:",s)}}renderMealPlans(){var t,e;return(e=(t=this.user)==null?void 0:t.mealPlans)!=null&&e.length?h`
      <ul>
        ${this.user.mealPlans.map(r=>{var s,n;return h`
            <li>
              <span>${r.name}</span>
              ${((n=(s=this.user)==null?void 0:s.currentMealPlan)==null?void 0:n._id)===r._id?h`<em>(Current)</em>`:h`
                    <button @click=${()=>this.setAsCurrent(r._id)}>
                      Set as Current
                    </button>
                  `}
            </li>
          `})}
      </ul>
    `:h`<p>You haven’t created any meal plans yet.</p>`}render(){return h`
      <mpn-header title="My Profile"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Profile Info</h2>
          ${this.user?h`
                <div class="info-block">
                  <p>
                    <span class="label">First Name:</span>
                    ${this.user.firstName}
                  </p>
                  <p>
                    <span class="label">Last Name:</span>
                    ${this.user.lastName}
                  </p>
                  <p>
                    <span class="label">Username:</span>
                    ${this.user.username}
                  </p>
                </div>

                <div class="info-block">
                  <h3>Current Meal Plan</h3>
                  ${this.user.currentMealPlan?h`
                        <p>
                          <a
                            href="/app/my-plans/${this.user.currentMealPlan._id}"
                          >
                            ${this.user.currentMealPlan.name}
                          </a>
                        </p>
                      `:h`<p>No meal plan selected.</p>`}
                </div>

                <div class="info-block">
                  <h3>Your Meal Plans</h3>
                  ${this.renderMealPlans()}
                </div>
              `:h`<p>Loading user info...</p>`}
        </mpn-card>

        <mpn-card class="col-span-12 signout-container">
          <button
            @click=${t=>Nr.relay(t,"auth:message",["auth/signout"])}
          >
            <svg class="icon">
              <use href="/icons/nutrition.svg#icon-profile" />
            </svg>
            Sign Out
          </button>
        </mpn-card>
      </mpn-main-grid>
    `}};qe.styles=[$.styles,E`
      h2,
      h3 {
        margin-bottom: var(--space-sm);
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border);
      }

      .info-block {
        margin-bottom: var(--space-md);
      }

      .label {
        font-weight: bold;
      }

      button {
        font: inherit;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      button:hover {
        background-color: #c75c1d;
      }

      .signout-container {
        display: flex;
        justify-content: center;
        margin-top: var(--space-md);
      }
    `];let Vt=qe;$n([x()],Vt.prototype,"user");var bn=Object.defineProperty,wn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&bn(t,e,s),s};const Fe=class Fe extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/recipes/public",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.recipes=t}).catch(t=>console.error("Error fetching recipes:",t))}renderRecipeList(){return this.recipes?h`
      <ul>
        ${this.recipes.map(t=>h`
            <li>
              <mpn-card>
                <a href="/app/discover/recipes/${t._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-cookbook"></use>
                  </svg>
                  ${t.name}
                </a>
              </mpn-card>
            </li>
          `)}
      </ul>
    `:h`Loading recipes...`}render(){return h`
      <mpn-header title="Public Recipe Library"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderRecipeList()}
        </section>
      </mpn-main-grid>
    `}};Fe.styles=[$.styles,E`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Wt=Fe;wn([x()],Wt.prototype,"recipes");const Ve=class Ve extends _{render(){return h`
      <mpn-header title="Create Account"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12 center-content">
          <div class="sequence">
            <h2>Sign Up</h2>
            <login-form api="/auth/register" redirect="/">
              <label>
                <span>Username:</span>
                <input name="username" autocomplete="off" />
              </label>
              <label>
                <span>Password:</span>
                <input type="password" name="password" />
              </label>
            </login-form>
          </div>
        </mpn-card>
        <div class="col-span-12">
          <p>
            Already have an account?
            <mpn-button-link href="/app/login">
              Log in
            </mpn-button-link>.
          </p>
        </div>
      </mpn-main-grid>
    `}};Ve.styles=[$.styles,E`
      mpn-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
      }
    `];let ye=Ve;var An=Object.defineProperty,dr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&An(t,e,s),s};const We=class We extends _{constructor(){super(...arguments),this.id="",this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.fetchRecipe()})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async fetchRecipe(){try{const t=await fetch(`/api/recipes/${this.id}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.recipe=await t.json()}catch(t){console.error("Failed to fetch recipe:",t)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((t,e)=>(t.calories+=e.calories||0,t.protein+=e.protein||0,t.carbs+=e.carbs||0,t.fat+=e.fat||0,t),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){return h`
      <mpn-header title="Recipe Details"></mpn-header>
      ${this.recipe?this.renderDetails():h`<p style="padding: var(--space-md)">Loading recipe...</p>`}
    `}renderDetails(){const t=this.computeNutrition();return h`
      <mpn-main-grid>
        <mpn-card class="col-span-6">
          <h2>Ingredients</h2>
          <ul>
            ${this.recipe.ingredients.map(e=>h`
                <li>
                  ${e.name}${e.unit?` – ${e.amount} ${e.unit}`:""}
                </li>
              `)}
          </ul>
        </mpn-card>

        <mpn-card class="col-span-6">
          <h2>Nutrition Summary</h2>
          <p>
            Calories: ${Math.round(t.calories)} |
            Protein: ${Math.round(t.protein)}g |
            Carbs: ${Math.round(t.carbs)}g |
            Fat: ${Math.round(t.fat)}g
          </p>
        </mpn-card>

        <mpn-card class="col-span-12">
          <h2>Instructions</h2>
          <ol>
            ${this.recipe.steps.map(e=>h`<li>${e}</li>`)}
          </ol>
        </mpn-card>
      </mpn-main-grid>
    `}};We.styles=[$.styles,E`
      h2 {
        margin-bottom: var(--space-sm);
      }

      p {
        margin-bottom: var(--space-md);
      }

      ol {
        padding-left: 1.5rem;
        margin-top: var(--space-sm);
      }

      li {
        margin-bottom: var(--space-sm);
      }
    `];let Et=We;dr([S({type:String})],Et.prototype,"id");dr([x()],Et.prototype,"recipe");var En=Object.defineProperty,fr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&En(t,e,s),s};const Ye=class Ye extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(t){try{const e=await fetch(t,{headers:this.authorization});this.recipe=await e.json()}catch(e){console.error("Failed to fetch recipe:",e)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((t,e)=>(t.calories+=e.calories||0,t.protein+=e.protein||0,t.carbs+=e.carbs||0,t.fat+=e.fat||0,t),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){if(!this.recipe)return h`<p>Loading recipe...</p>`;const t=this.computeNutrition();return h`
      <mpn-main-grid>
        <mpn-card class="col-span-6">
          <h2>Ingredients</h2>
          <mpn-ingredients-list>
            ${this.recipe.ingredients.map(e=>h`<li>
                  ${e.name}${e.unit?` – ${e.amount} ${e.unit}`:""}
                </li>`)}
          </mpn-ingredients-list>
        </mpn-card>

        <mpn-card class="col-span-6">
          <h2>Nutrition Summary</h2>
          <p>
            Calories: ${Math.round(t.calories)} |
            Protein: ${Math.round(t.protein)}g |
            Carbs: ${Math.round(t.carbs)}g |
            Fat: ${Math.round(t.fat)}g
          </p>
        </mpn-card>

        <mpn-card class="col-span-12">
          <h2>Instructions</h2>
          <ol>
            ${this.recipe.steps.map(e=>h`<li>${e}</li>`)}
          </ol>
        </mpn-card>
      </mpn-main-grid>
    `}};Ye.styles=[$.styles,E`
      h2 {
        margin-bottom: var(--space-sm);
      }

      p {
        margin-bottom: var(--space-md);
      }

      ol {
        padding-left: 1.5rem;
        margin-top: var(--space-sm);
      }

      li {
        margin-bottom: var(--space-sm);
      }
    `];let St=Ye;fr([S()],St.prototype,"src");fr([x()],St.prototype,"recipe");var Sn=Object.defineProperty,xn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Sn(t,e,s),s};const Ke=class Ke extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/mealplans/private",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.mealPlans=t}).catch(t=>console.error("Error fetching personal meal plans:",t))}renderPlanList(){return this.mealPlans?h`
      <ul>
        ${this.mealPlans.map(t=>h`
            <li>
              <mpn-card>
                <a href="/app/my-plans/${t._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-meal-plan"></use>
                  </svg>
                  ${t.name}
                </a>
              </mpn-card>
            </li>
          `)}
      </ul>
    `:h`Loading your meal plans...`}render(){return h`
      <mpn-header title="My Meal Plans"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>

       <section class="col-span-12">
          <mpn-button-link href="/app/my-plans/create">
            Create New Plan
          </mpn-button-link>
        </section>
      </mpn-main-grid>
    `}};Ke.styles=[$.styles,E`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Yt=Ke;xn([x()],Yt.prototype,"mealPlans");var Pn=Object.defineProperty,kn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Pn(t,e,s),s};const Je=class Je extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/recipes/private",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.recipes=t}).catch(t=>console.error("Error fetching personal recipes:",t))}renderRecipeList(){return this.recipes?h`
      <ul>
        ${this.recipes.map(t=>h`
            <li>
              <mpn-card>
                <a href="/app/my-recipes/${t._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-recipe"></use>
                  </svg>
                  ${t.name}
                </a>
              </mpn-card>
            </li>
          `)}
      </ul>
    `:h`Loading your recipes...`}render(){return h`
      <mpn-header title="My Recipes"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderRecipeList()}
        </section>

        <section class="col-span-12">
          <mpn-button-link href="/app/my-recipes/create">
            Create New Recipe
          </mpn-button-link>
        </section>
      </mpn-main-grid>
    `}};Je.styles=[$.styles,E`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Kt=Je;kn([x()],Kt.prototype,"recipes");const Cn=[{path:"/",redirect:"/app"},{path:"/app",view:()=>h`<home-view></home-view>`},{path:"/app/login",view:()=>h`<login-view></login-view>`},{path:"/app/sign-up",view:()=>h`<signup-view></signup-view>`},{path:"/app/profile",view:()=>h`<profile-view></profile-view>`},{path:"/app/my-plans",view:()=>h`<my-plans-view></my-plans-view>`},{path:"/app/my-plans/:id",view:i=>h`
      <plan-view id=${i.id}></plan-view>
    `},{path:"/app/my-recipes",view:()=>h`<my-recipes-view></my-recipes-view>`},{path:"/app/my-recipes/:id",view:i=>h`
      <recipe-view id=${i.id}></recipe-view>
    `},{path:"/app/discover",redirect:"/app/discover/plans"},{path:"/app/discover/plans",view:()=>h` <shared-plans-view></shared-plans-view> `},{path:"/app/discover/plans/:id",view:i=>h`
      <plan-view id=${i.id}></plan-view>
    `},{path:"/app/discover/recipes",view:()=>h`<shared-recipes-view></shared-recipes-view>`},{path:"/app/discover/recipes/:id",view:i=>h`
      <recipe-view id=${i.id}></recipe-view>
    `},{path:"/app/my-plans/create",view:()=>h`<create-plan-view></create-plan-view>`},{path:"/app/my-recipes/create",view:()=>h`<create-recipe-view></create-plan-view>`}];Ni({"mu-auth":Rr.Provider,"mu-history":zr.Provider,"mpn-header":M,"mpn-card":me,"mpn-main-grid":ge,"mpn-button-link":Bt,"mpn-meal-plan":qt,"mpn-meal-day":L,"mpn-recipe-link":At,"login-form":Y,"mpn-recipe-details":St,"home-view":at,"login-view":ve,"plan-view":wt,"shared-plans-view":Ft,"profile-view":Vt,"shared-recipes-view":Wt,"signup-view":ye,"recipe-view":Et,"my-plans-view":Yt,"my-recipes-view":Kt,"mu-switch":class extends Oi.Element{constructor(){super(Cn,"mpn:history","mpn:auth")}}});
