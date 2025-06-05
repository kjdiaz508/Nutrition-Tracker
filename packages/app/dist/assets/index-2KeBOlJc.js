(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var X,cs;class ft extends Error{}ft.prototype.name="InvalidTokenError";function Nr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function Rr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Nr(t)}catch{return atob(t)}}function Is(i,t){if(typeof i!="string")throw new ft("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new ft(`Invalid token specified: missing part #${e+1}`);let s;try{s=Rr(r)}catch(n){throw new ft(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new ft(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Mr="mu:context",ve=`${Mr}:change`;class Ur{constructor(t,e){this._proxy=jr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class xe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ur(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ve,t),t}detach(t){this.removeEventListener(ve,t)}}function jr(i,t){return new Proxy(i,{get:(r,s,n)=>{if(s==="then")return;const o=Reflect.get(r,s,n);return console.log(`Context['${s}'] => `,o),o},set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(ve,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function Lr(i,t){const e=zs(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function zs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return zs(i,s.host)}class Ir extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Ds(i="mu:message"){return(t,...e)=>t.dispatchEvent(new Ir(e,i))}class ke{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function zr(i){return t=>({...t,...i})}const ye="mu:auth:jwt",Hs=class Bs extends ke{constructor(t,e){super((r,s)=>this.update(r,s),t,Bs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(Hr(r)),ue(s);case"auth/signout":return e(Br()),ue(this._redirectForLogin);case"auth/redirect":return ue(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Hs.EVENT_TYPE="auth:message";let Fs=Hs;const qs=Ds(Fs.EVENT_TYPE);function ue(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,n])=>r.searchParams.set(s,n)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class Dr extends xe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=it.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new Fs(this.context,this.redirect).attach(this)}}class rt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ye),t}}class it extends rt{constructor(t){super();const e=Is(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new it(t);return localStorage.setItem(ye,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ye);return t?it.authenticate(t):new rt}}function Hr(i){return zr({user:it.authenticate(i),token:i})}function Br(){return i=>{const t=i.user;return{user:t&&t.authenticated?rt.deauthenticate(t):t,token:""}}}function Fr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function qr(i){return i.authenticated?Is(i.token||""):{}}const Gt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:it,Provider:Dr,User:rt,dispatch:qs,headers:Fr,payload:qr},Symbol.toStringTag,{value:"Module"}));function It(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function _e(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}const Vr=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:_e,relay:It},Symbol.toStringTag,{value:"Module"}));function Vs(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const Wr=new DOMParser;function F(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=Wr.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const p=f.parentNode;p==null||p.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return hs(a);case"bigint":case"boolean":case"number":case"symbol":return hs(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,p=a.map(l);return f.replaceChildren(...p),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function hs(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function te(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}let Yr=(X=class extends HTMLElement{constructor(){super(),this._state={},te(this).template(X.template).styles(X.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),It(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},Jr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},X.template=F`
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
  `,X.styles=Vs`
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
  `,X);function Jr(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return i}const Ws=Object.freeze(Object.defineProperty({__proto__:null,Element:Yr},Symbol.toStringTag,{value:"Module"})),Ys=class Js extends ke{constructor(t){super((e,r)=>this.update(e,r),t,Js.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(Zr(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(Qr(r,s));break}}}};Ys.EVENT_TYPE="history:message";let Pe=Ys;class us extends xe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Kr(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Ce(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Pe(this.context).attach(this)}}function Kr(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function Zr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function Qr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const Ce=Ds(Pe.EVENT_TYPE),Xr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:us,Provider:us,Service:Pe,dispatch:Ce},Symbol.toStringTag,{value:"Module"}));class k{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new ps(this._provider,t);this._effects.push(s),e(s)}else Lr(this._target,this._contextLabel).then(s=>{const n=new ps(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ps{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Ks=class Zs extends HTMLElement{constructor(){super(),this._state={},this._user=new rt,this._authObserver=new k(this,"blazing:auth"),te(this).template(Zs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;Gr(s,this._state,e,this.authorization).then(n=>ut(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ut(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ds(this.src,this.authorization).then(e=>{this._state=e,ut(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&ds(this.src,this.authorization).then(s=>{this._state=s,ut(s,this)});break;case"new":r&&(this._state={},ut({},this));break}}};Ks.observedAttributes=["src","new","action"];Ks.template=F`
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
  `;function ds(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ut(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function Gr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const Qs=class Xs extends ke{constructor(t,e){super(e,t,Xs.EVENT_TYPE,!1)}};Qs.EVENT_TYPE="mu:message";let Gs=Qs;class ti extends xe{constructor(t,e,r){super(e),this._user=new rt,this._updateFn=t,this._authObserver=new k(this,r)}connectedCallback(){const t=new Gs(this.context,(e,r)=>this._updateFn(e,r,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ei=Object.freeze(Object.defineProperty({__proto__:null,Provider:ti,Service:Gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jt=globalThis,Oe=jt.ShadowRoot&&(jt.ShadyCSS===void 0||jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),ms=new WeakMap;let tr=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Oe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ms.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ms.set(e,t))}return t}toString(){return this.cssText}};const si=i=>new tr(typeof i=="string"?i:i+"",void 0,Te),ri=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new tr(e,i,Te)},ii=(i,t)=>{if(Oe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=jt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},fs=Oe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return si(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ni,defineProperty:oi,getOwnPropertyDescriptor:ai,getOwnPropertyNames:li,getOwnPropertySymbols:ci,getPrototypeOf:hi}=Object,nt=globalThis,gs=nt.trustedTypes,ui=gs?gs.emptyScript:"",vs=nt.reactiveElementPolyfillSupport,gt=(i,t)=>i,zt={toAttribute(i,t){switch(t){case Boolean:i=i?ui:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ne=(i,t)=>!ni(i,t),ys={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:Ne};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),nt.litPropertyMetadata??(nt.litPropertyMetadata=new WeakMap);let tt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ys){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&oi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=ai(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ys}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const t=hi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const e=this.properties,r=[...li(e),...ci(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(fs(s))}else t!==void 0&&e.push(fs(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ii(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:zt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:zt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??Ne)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};tt.elementStyles=[],tt.shadowRootOptions={mode:"open"},tt[gt("elementProperties")]=new Map,tt[gt("finalized")]=new Map,vs==null||vs({ReactiveElement:tt}),(nt.reactiveElementVersions??(nt.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dt=globalThis,Ht=Dt.trustedTypes,_s=Ht?Ht.createPolicy("lit-html",{createHTML:i=>i}):void 0,er="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,sr="?"+N,pi=`<${sr}>`,V=document,_t=()=>V.createComment(""),bt=i=>i===null||typeof i!="object"&&typeof i!="function",Re=Array.isArray,di=i=>Re(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",pe=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bs=/-->/g,$s=/>/g,z=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ws=/'/g,As=/"/g,rr=/^(?:script|style|textarea|title)$/i,mi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),dt=mi(1),ot=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),Es=new WeakMap,H=V.createTreeWalker(V,129);function ir(i,t){if(!Re(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return _s!==void 0?_s.createHTML(t):t}const fi=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=pt;for(let l=0;l<e;l++){const a=i[l];let d,f,p=-1,h=0;for(;h<a.length&&(o.lastIndex=h,f=o.exec(a),f!==null);)h=o.lastIndex,o===pt?f[1]==="!--"?o=bs:f[1]!==void 0?o=$s:f[2]!==void 0?(rr.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=s??pt,p=-1):f[1]===void 0?p=-2:(p=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?z:f[3]==='"'?As:ws):o===As||o===ws?o=z:o===bs||o===$s?o=pt:(o=z,s=void 0);const u=o===z&&i[l+1].startsWith("/>")?" ":"";n+=o===pt?a+pi:p>=0?(r.push(d),a.slice(0,p)+er+a.slice(p)+N+u):a+N+(p===-2?l:u)}return[ir(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let be=class nr{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=fi(t,e);if(this.el=nr.createElement(d,r),H.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(er)){const h=f[o++],u=s.getAttribute(p).split(N),m=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:m[2],strings:u,ctor:m[1]==="."?vi:m[1]==="?"?yi:m[1]==="@"?_i:ee}),s.removeAttribute(p)}else p.startsWith(N)&&(a.push({type:6,index:n}),s.removeAttribute(p));if(rr.test(s.tagName)){const p=s.textContent.split(N),h=p.length-1;if(h>0){s.textContent=Ht?Ht.emptyScript:"";for(let u=0;u<h;u++)s.append(p[u],_t()),H.nextNode(),a.push({type:2,index:++n});s.append(p[h],_t())}}}else if(s.nodeType===8)if(s.data===sr)a.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(N,p+1))!==-1;)a.push({type:7,index:n}),p+=N.length-1}n++}}static createElement(t,e){const r=V.createElement("template");return r.innerHTML=t,r}};function at(i,t,e=i,r){var s,n;if(t===ot)return t;let o=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=bt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=o:e.l=o),o!==void 0&&(t=at(i,o._$AS(i,t.values),o,r)),t}class gi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??V).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Ct(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new bi(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=V,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Ct{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=at(this,t,e),bt(t)?t===S||t==null||t===""?(this._$AH!==S&&this._$AR(),this._$AH=S):t!==this._$AH&&t!==ot&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):di(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==S&&bt(this._$AH)?this._$AA.nextSibling.data=t:this.T(V.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=be.createElement(ir(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new gi(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=Es.get(t.strings);return e===void 0&&Es.set(t.strings,e=new be(t)),e}k(t){Re(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Ct(this.O(_t()),this.O(_t()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=S,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=S}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=at(this,t,e,0),o=!bt(t)||t!==this._$AH&&t!==ot,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=at(this,l[r+a],e,a),d===ot&&(d=this._$AH[a]),o||(o=!bt(d)||d!==this._$AH[a]),d===S?t=S:t!==S&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class vi extends ee{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===S?void 0:t}}class yi extends ee{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==S)}}class _i extends ee{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=at(this,t,e,0)??S)===ot)return;const r=this._$AH,s=t===S&&r!==S||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==S&&(r===S||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class bi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){at(this,t)}}const Ss=Dt.litHtmlPolyfillSupport;Ss==null||Ss(be,Ct),(Dt.litHtmlVersions??(Dt.litHtmlVersions=[])).push("3.2.0");const $i=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new Ct(t.insertBefore(_t(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let st=class extends tt{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=$i(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return ot}};st._$litElement$=!0,st.finalized=!0,(cs=globalThis.litElementHydrateSupport)==null||cs.call(globalThis,{LitElement:st});const xs=globalThis.litElementPolyfillSupport;xs==null||xs({LitElement:st});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wi={attribute:!0,type:String,converter:zt,reflect:!1,hasChanged:Ne},Ai=(i=wi,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function or(i){return(t,e)=>typeof e=="object"?Ai(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ar(i){return or({...i,state:!0,attribute:!1})}function Ei(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Si(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var lr={};(function(i){var t=function(){var e=function(p,h,u,m){for(u=u||{},m=p.length;m--;u[p[m]]=h);return u},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(h,u,m,v,g,y,oe){var C=y.length-1;switch(g){case 1:return new v.Root({},[y[C-1]]);case 2:return new v.Root({},[new v.Literal({value:""})]);case 3:this.$=new v.Concat({},[y[C-1],y[C]]);break;case 4:case 5:this.$=y[C];break;case 6:this.$=new v.Literal({value:y[C]});break;case 7:this.$=new v.Splat({name:y[C]});break;case 8:this.$=new v.Param({name:y[C]});break;case 9:this.$=new v.Optional({},[y[C-1]]);break;case 10:this.$=h;break;case 11:case 12:this.$=h.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(h,u){if(u.recoverable)this.trace(h);else{let m=function(v,g){this.message=v,this.hash=g};throw m.prototype=Error,new m(h,u)}},parse:function(h){var u=this,m=[0],v=[null],g=[],y=this.table,oe="",C=0,os=0,Pr=2,as=1,Cr=g.slice.call(arguments,1),E=Object.create(this.lexer),L={yy:{}};for(var ae in this.yy)Object.prototype.hasOwnProperty.call(this.yy,ae)&&(L.yy[ae]=this.yy[ae]);E.setInput(h,L.yy),L.yy.lexer=E,L.yy.parser=this,typeof E.yylloc>"u"&&(E.yylloc={});var le=E.yylloc;g.push(le);var Or=E.options&&E.options.ranges;typeof L.yy.parseError=="function"?this.parseError=L.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Tr=function(){var Q;return Q=E.lex()||as,typeof Q!="number"&&(Q=u.symbols_[Q]||Q),Q},P,I,O,ce,Z={},Mt,T,ls,Ut;;){if(I=m[m.length-1],this.defaultActions[I]?O=this.defaultActions[I]:((P===null||typeof P>"u")&&(P=Tr()),O=y[I]&&y[I][P]),typeof O>"u"||!O.length||!O[0]){var he="";Ut=[];for(Mt in y[I])this.terminals_[Mt]&&Mt>Pr&&Ut.push("'"+this.terminals_[Mt]+"'");E.showPosition?he="Parse error on line "+(C+1)+`:
`+E.showPosition()+`
Expecting `+Ut.join(", ")+", got '"+(this.terminals_[P]||P)+"'":he="Parse error on line "+(C+1)+": Unexpected "+(P==as?"end of input":"'"+(this.terminals_[P]||P)+"'"),this.parseError(he,{text:E.match,token:this.terminals_[P]||P,line:E.yylineno,loc:le,expected:Ut})}if(O[0]instanceof Array&&O.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+P);switch(O[0]){case 1:m.push(P),v.push(E.yytext),g.push(E.yylloc),m.push(O[1]),P=null,os=E.yyleng,oe=E.yytext,C=E.yylineno,le=E.yylloc;break;case 2:if(T=this.productions_[O[1]][1],Z.$=v[v.length-T],Z._$={first_line:g[g.length-(T||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(T||1)].first_column,last_column:g[g.length-1].last_column},Or&&(Z._$.range=[g[g.length-(T||1)].range[0],g[g.length-1].range[1]]),ce=this.performAction.apply(Z,[oe,os,C,L.yy,O[1],v,g].concat(Cr)),typeof ce<"u")return ce;T&&(m=m.slice(0,-1*T*2),v=v.slice(0,-1*T),g=g.slice(0,-1*T)),m.push(this.productions_[O[1]][0]),v.push(Z.$),g.push(Z._$),ls=y[m[m.length-2]][m[m.length-1]],m.push(ls);break;case 3:return!0}}return!0}},d=function(){var p={EOF:1,parseError:function(u,m){if(this.yy.parser)this.yy.parser.parseError(u,m);else throw new Error(u)},setInput:function(h,u){return this.yy=u||this.yy||{},this._input=h,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var h=this._input[0];this.yytext+=h,this.yyleng++,this.offset++,this.match+=h,this.matched+=h;var u=h.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),h},unput:function(h){var u=h.length,m=h.split(/(?:\r\n?|\n)/g);this._input=h+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var v=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),m.length-1&&(this.yylineno-=m.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:m?(m.length===v.length?this.yylloc.first_column:0)+v[v.length-m.length].length-m[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(h){this.unput(this.match.slice(h))},pastInput:function(){var h=this.matched.substr(0,this.matched.length-this.match.length);return(h.length>20?"...":"")+h.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var h=this.match;return h.length<20&&(h+=this._input.substr(0,20-h.length)),(h.substr(0,20)+(h.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var h=this.pastInput(),u=new Array(h.length+1).join("-");return h+this.upcomingInput()+`
`+u+"^"},test_match:function(h,u){var m,v,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),v=h[0].match(/(?:\r\n?|\n).*/g),v&&(this.yylineno+=v.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:v?v[v.length-1].length-v[v.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+h[0].length},this.yytext+=h[0],this.match+=h[0],this.matches=h,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(h[0].length),this.matched+=h[0],m=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),m)return m;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var h,u,m,v;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(m=this._input.match(this.rules[g[y]]),m&&(!u||m[0].length>u[0].length)){if(u=m,v=y,this.options.backtrack_lexer){if(h=this.test_match(m,g[y]),h!==!1)return h;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(h=this.test_match(u,g[v]),h!==!1?h:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var u=this.next();return u||this.lex()},begin:function(u){this.conditionStack.push(u)},popState:function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},pushState:function(u){this.begin(u)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(u,m,v,g){switch(v){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return p}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Si<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(lr);function G(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var cr={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},hr=lr.parser;hr.yy=cr;var xi=hr,ki=Object.keys(cr);function Pi(i){return ki.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ur=Pi,Ci=ur,Oi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function pr(i){this.captures=i.captures,this.re=i.re}pr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var Ti=Ci({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Oi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new pr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ni=Ti,Ri=ur,Mi=Ri({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Ui=Mi,ji=xi,Li=Ni,Ii=Ui;Ot.prototype=Object.create(null);Ot.prototype.match=function(i){var t=Li.visit(this.ast),e=t.match(i);return e||!1};Ot.prototype.reverse=function(i){return Ii.visit(this.ast,i)};function Ot(i){var t;if(this?t=this:t=Object.create(Ot.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ji.parse(i),t}var zi=Ot,Di=zi,Hi=Di;const Bi=Ei(Hi);var Fi=Object.defineProperty,dr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Fi(t,e,s),s};const mr=class extends st{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>dt` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new Bi(s.path)})),this._historyObserver=new k(this,e),this._authObserver=new k(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),dt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(qs(this,"auth/redirect"),dt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):dt` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),dt` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){Ce(this,"history/redirect",{href:t})}};mr.styles=ri`
    :host,
    main {
      display: contents;
    }
  `;let Bt=mr;dr([ar()],Bt.prototype,"_user");dr([ar()],Bt.prototype,"_match");const qi=Object.freeze(Object.defineProperty({__proto__:null,Element:Bt,Switch:Bt},Symbol.toStringTag,{value:"Module"})),Vi=class fr extends HTMLElement{constructor(){if(super(),te(this).template(fr.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Vi.template=F`
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
  `;const gr=class $e extends HTMLElement{constructor(){super(),this._array=[],te(this).template($e.template).styles($e.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(vr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{_e(t,"button.add")?It(t,"input-array:add"):_e(t,"button.remove")&&It(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Wi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};gr.template=F`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;gr.styles=Vs`
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
  `;function Wi(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(vr(e)))}function vr(i,t){const e=i===void 0?F`<input />`:F`<input value="${i}" />`;return F`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Me(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Yi=Object.defineProperty,Ji=Object.getOwnPropertyDescriptor,Ki=(i,t,e,r)=>{for(var s=Ji(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Yi(t,e,s),s};class Ue extends st{constructor(t){super(),this._pending=[],this._observer=new k(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}Ki([or()],Ue.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt=globalThis,je=Lt.ShadowRoot&&(Lt.ShadyCSS===void 0||Lt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Le=Symbol(),ks=new WeakMap;let yr=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(je&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=ks.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ks.set(e,t))}return t}toString(){return this.cssText}};const Zi=i=>new yr(typeof i=="string"?i:i+"",void 0,Le),w=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new yr(e,i,Le)},Qi=(i,t)=>{if(je)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Lt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Ps=je?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return Zi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Xi,defineProperty:Gi,getOwnPropertyDescriptor:tn,getOwnPropertyNames:en,getOwnPropertySymbols:sn,getPrototypeOf:rn}=Object,M=globalThis,Cs=M.trustedTypes,nn=Cs?Cs.emptyScript:"",de=M.reactiveElementPolyfillSupport,vt=(i,t)=>i,Ft={toAttribute(i,t){switch(t){case Boolean:i=i?nn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ie=(i,t)=>!Xi(i,t),Os={attribute:!0,type:String,converter:Ft,reflect:!1,useDefault:!1,hasChanged:Ie};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),M.litPropertyMetadata??(M.litPropertyMetadata=new WeakMap);let et=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Os){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Gi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=tn(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Os}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;const t=rn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){const e=this.properties,r=[...en(e),...sn(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Ps(s))}else t!==void 0&&e.push(Ps(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Ft).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=r.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Ft;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??Ie)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};et.elementStyles=[],et.shadowRootOptions={mode:"open"},et[vt("elementProperties")]=new Map,et[vt("finalized")]=new Map,de==null||de({ReactiveElement:et}),(M.reactiveElementVersions??(M.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis,qt=yt.trustedTypes,Ts=qt?qt.createPolicy("lit-html",{createHTML:i=>i}):void 0,_r="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,br="?"+R,on=`<${br}>`,W=document,$t=()=>W.createComment(""),wt=i=>i===null||typeof i!="object"&&typeof i!="function",ze=Array.isArray,an=i=>ze(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",me=`[ 	
\f\r]`,mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ns=/-->/g,Rs=/>/g,D=RegExp(`>|${me}(?:([^\\s"'>=/]+)(${me}*=${me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ms=/'/g,Us=/"/g,$r=/^(?:script|style|textarea|title)$/i,ln=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),c=ln(1),lt=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),js=new WeakMap,B=W.createTreeWalker(W,129);function wr(i,t){if(!ze(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ts!==void 0?Ts.createHTML(t):t}const cn=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=mt;for(let l=0;l<e;l++){const a=i[l];let d,f,p=-1,h=0;for(;h<a.length&&(o.lastIndex=h,f=o.exec(a),f!==null);)h=o.lastIndex,o===mt?f[1]==="!--"?o=Ns:f[1]!==void 0?o=Rs:f[2]!==void 0?($r.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=D):f[3]!==void 0&&(o=D):o===D?f[0]===">"?(o=s??mt,p=-1):f[1]===void 0?p=-2:(p=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?D:f[3]==='"'?Us:Ms):o===Us||o===Ms?o=D:o===Ns||o===Rs?o=mt:(o=D,s=void 0);const u=o===D&&i[l+1].startsWith("/>")?" ":"";n+=o===mt?a+on:p>=0?(r.push(d),a.slice(0,p)+_r+a.slice(p)+R+u):a+R+(p===-2?l:u)}return[wr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class At{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=cn(t,e);if(this.el=At.createElement(d,r),B.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=B.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const p of s.getAttributeNames())if(p.endsWith(_r)){const h=f[o++],u=s.getAttribute(p).split(R),m=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:m[2],strings:u,ctor:m[1]==="."?un:m[1]==="?"?pn:m[1]==="@"?dn:se}),s.removeAttribute(p)}else p.startsWith(R)&&(a.push({type:6,index:n}),s.removeAttribute(p));if($r.test(s.tagName)){const p=s.textContent.split(R),h=p.length-1;if(h>0){s.textContent=qt?qt.emptyScript:"";for(let u=0;u<h;u++)s.append(p[u],$t()),B.nextNode(),a.push({type:2,index:++n});s.append(p[h],$t())}}}else if(s.nodeType===8)if(s.data===br)a.push({type:2,index:n});else{let p=-1;for(;(p=s.data.indexOf(R,p+1))!==-1;)a.push({type:7,index:n}),p+=R.length-1}n++}}static createElement(t,e){const r=W.createElement("template");return r.innerHTML=t,r}}function ct(i,t,e=i,r){var o,l;if(t===lt)return t;let s=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl;const n=wt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=ct(i,s._$AS(i,t.values),s,r)),t}class hn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??W).importNode(e,!0);B.currentNode=s;let n=B.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Tt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new mn(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=B.nextNode(),o++)}return B.currentNode=W,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Tt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ct(this,t,e),wt(t)?t===x||t==null||t===""?(this._$AH!==x&&this._$AR(),this._$AH=x):t!==this._$AH&&t!==lt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):an(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==x&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.T(W.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=At.createElement(wr(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new hn(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=js.get(t.strings);return e===void 0&&js.set(t.strings,e=new At(t)),e}k(t){ze(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new Tt(this.O($t()),this.O($t()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class se{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=x,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=x}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=ct(this,t,e,0),o=!wt(t)||t!==this._$AH&&t!==lt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=ct(this,l[r+a],e,a),d===lt&&(d=this._$AH[a]),o||(o=!wt(d)||d!==this._$AH[a]),d===x?t=x:t!==x&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class un extends se{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===x?void 0:t}}class pn extends se{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==x)}}class dn extends se{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=ct(this,t,e,0)??x)===lt)return;const r=this._$AH,s=t===x&&r!==x||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==x&&(r===x||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class mn{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ct(this,t)}}const fe=yt.litHtmlPolyfillSupport;fe==null||fe(At,Tt),(yt.litHtmlVersions??(yt.litHtmlVersions=[])).push("3.3.0");const fn=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new Tt(t.insertBefore($t(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis;class _ extends et{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=fn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return lt}}var Ls;_._$litElement$=!0,_.finalized=!0,(Ls=q.litElementHydrateSupport)==null||Ls.call(q,{LitElement:_});const ge=q.litElementPolyfillSupport;ge==null||ge({LitElement:_});(q.litElementVersions??(q.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gn={attribute:!0,type:String,converter:Ft,reflect:!1,hasChanged:Ie},vn=(i=gn,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function A(i){return(t,e)=>typeof e=="object"?vn(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(i){return A({...i,state:!0,attribute:!1})}const yn=w`
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
`,$={styles:yn};var _n=Object.defineProperty,Nt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&_n(t,e,s),s};const He=class He extends _{constructor(){super(...arguments),this.title="",this.label="Back",this.hideBack=!1,this._authObserver=new k(this,"mpn:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback();const t=localStorage.getItem("dark-mode")==="true";document.body.classList.toggle("dark-mode",t),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector('input[type="checkbox"]');e&&(e.checked=t)}),this._authObserver.observe(e=>{const{user:r}=e;console.log("user: ",r),r&&r.authenticated?(console.log("authenticated"),this.loggedIn=!0,this.userid=r.username):(this.loggedIn=!1,this.userid=void 0)})}renderProfileButton(){return c`
      <mpn-button-link href="/app/profile" class="button-link">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        My Profile
      </mpn-button-link>
    `}renderSignInButton(){return c`
      <mpn-button-link href="/app/login">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        Sign In
      </mpn-button-link>
    `}renderNavButtons(){return c`
      <nav>
        <ul class="row">
          ${this.hideBack?c`<li>
            ${this.loggedIn?this.renderProfileButton():this.renderSignInButton()}
          </li>`:c`<li>${this.renderBackButton()}</li>`}
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
    `}renderBackButton(){return c`
      <nav>
        <button class="button-link" @click=${()=>history.back()}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-back">
        </svg>
          ${this.label}
        </button>
      </nav>
    `}toggleTheme(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e),localStorage.setItem("dark-mode",String(e))}render(){return console.log("logged in: ",this.loggedIn),c`
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
    `}};He.styles=[$.styles,w`
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
    `];let U=He;Nt([A()],U.prototype,"title");Nt([A()],U.prototype,"label");Nt([A({type:Boolean})],U.prototype,"hideBack");Nt([b()],U.prototype,"loggedIn");Nt([b()],U.prototype,"userid");const Be=class Be extends _{render(){return c`<slot></slot>`}};Be.styles=[$.styles,w`
      :host {
        display: block;
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `];let we=Be;const Fe=class Fe extends _{render(){return c`
      <main>
        <slot></slot>
      </main>
    `}};Fe.styles=[$.styles,w`
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
    `];let Ae=Fe;var bn=Object.defineProperty,De=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&bn(t,e,s),s};const qe=class qe extends _{constructor(){super(...arguments),this.todayRecipes=[],this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;(e=t.user)!=null&&e.authenticated&&(this._user=t.user,this.hydrate())})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){try{const e=await(await fetch(`/api/users/${this._user.username}`,{headers:this.authorization})).json();this.user=e,this.mealPlan=e.currentMealPlan,console.log("mp:",this.mealPlan);const r=new Date().toLocaleDateString("en-US",{weekday:"long"}),s=this.mealPlan.days.find(n=>n.weekday.toLowerCase()===r.toLowerCase());this.todayRecipes=(s==null?void 0:s.recipes)||[],console.log(this.todayRecipes)}catch(t){console.error("Error fetching current user or meal plan:",t)}}renderToday(){return this.todayRecipes.length?c`
      <ul>
        ${this.todayRecipes.map(t=>c`
            <li>
              <a href="/app/my-recipes/${t._id}">${t.name}</a>
            </li>
          `)}
      </ul>
    `:c`<p>No meals planned for today.</p>`}render(){return c`
      <mpn-header title="Meal Prep & Nutrition Organizer" hideBack></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Welcome!</h2>
          <p>
            Use this app to explore meal plans, view detailed nutrition info,
            and prep your week efficiently.
          </p>
          <div class="link-group">
            <a class="button-link" href="/app/my-plans/create">Create Meal Plan</a>
            <a class="button-link" href="/app/my-plans">My Meal Plans</a>
          </div>
        </mpn-card>

        ${this.mealPlan?c`
              <mpn-card class="col-span-12">
                <h3>Current Meal Plan:</h3>
                <p>
                  <a class="mealplan-link" href="/app/my-plans/${this.mealPlan._id}">
                    ${this.mealPlan.name}
                  </a>
                </p>
              </mpn-card>

              <mpn-card class="col-span-12">
                <h3>Today's Meals (${new Date().toLocaleDateString(void 0,{weekday:"long"})}):</h3>
                ${this.renderToday()}
              </mpn-card>
            `:c`
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
    `}};qe.styles=[$.styles,w`
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

      .link-group {
        margin-top: var(--space-md);
        display: flex;
        gap: var(--space-md);
        flex-wrap: wrap;
      }

      .button-link {
        display: inline-block;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }

      .button-link:hover {
        background-color: #c75c1d;
      }

      .mealplan-link {
        font-weight: bold;
        color: var(--color-accent);
      }
    `];let ht=qe;De([b()],ht.prototype,"user");De([b()],ht.prototype,"mealPlan");De([b()],ht.prototype,"todayRecipes");var $n=Object.defineProperty,wn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&$n(t,e,s),s};const Ve=class Ve extends _{constructor(){super(...arguments),this.href=""}render(){return c`
      <a href=${this.href}>
        <slot></slot>
      </a>
    `}};Ve.styles=[$.styles,w`
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
    `];let Vt=Ve;wn([A()],Vt.prototype,"href");const We=class We extends _{render(){return c`
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
    `}};We.styles=[$.styles,w`
      mpn-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
      }

    `];let Ee=We;var An=Object.defineProperty,re=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&An(t,e,s),s};const Ye=class Ye extends _{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return c`
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
    `}handleChange(t){const e=t.target,r=e==null?void 0:e.name,s=e==null?void 0:e.value,n=this.formData;switch(r){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(({token:e})=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{console.error(e),this.error=e.toString()})}};Ye.styles=[$.styles,w`
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
    `];let Y=Ye;re([b()],Y.prototype,"formData");re([A()],Y.prototype,"api");re([A()],Y.prototype,"redirect");re([b()],Y.prototype,"error");var En=Object.defineProperty,Ar=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&En(t,e,s),s};const Je=class Je extends _{constructor(){super(...arguments),this.id="",this._authObserver=new k(this,"mpn:auth")}get src(){return`/api/mealplans/${this.id}`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(t){fetch(t,{headers:this.authorization}).then(e=>e.json()).then(e=>{this.mealPlan=e}).catch(e=>console.error("Error fetching meal plan:",e))}render(){var t;return c`
      <mpn-header title=${(t=this.mealPlan)==null?void 0:t.name}></mpn-header>

      <mpn-main-grid>
        <section class="col-span-12">
          <mpn-meal-plan .mealPlan=${this.mealPlan}></mpn-meal-plan>
        </section>
      </mpn-main-grid>
    `}};Je.styles=[$.styles];let Et=Je;Ar([A({type:String})],Et.prototype,"id");Ar([b()],Et.prototype,"mealPlan");var Sn=Object.defineProperty,xn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Sn(t,e,s),s};const Ke=class Ke extends _{computeNutrition(t){const e={calories:0,protein:0,carbs:0,fat:0};for(const r of t)for(const s of r.ingredients)e.calories+=s.calories||0,e.protein+=s.protein||0,e.carbs+=s.carbs||0,e.fat+=s.fat||0;return{calories:Math.round(e.calories).toString(),protein:Math.round(e.protein).toString(),carbs:Math.round(e.carbs).toString(),fat:Math.round(e.fat).toString()}}render(){return this.mealPlan?c`
      <section>
        ${this.mealPlan.days.map(t=>{const e=this.computeNutrition(t.recipes);return c`
            <mpn-meal-day
              day=${t.weekday}
              calories=${e.calories}
              protein=${e.protein}
              carbs=${e.carbs}
              fat=${e.fat}
            >
              ${t.recipes.map(r=>c`
                  <mpn-recipe-link
                    href="/app/discover/recipes/${r._id}"
                    title=${r.name}
                  ></mpn-recipe-link>
                `)}
            </mpn-meal-day>
          `})}
      </section>
    `:c`<p>Loading meal plan...</p>`}};Ke.styles=[$.styles];let Wt=Ke;xn([A()],Wt.prototype,"mealPlan");var kn=Object.defineProperty,Rt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&kn(t,e,s),s};const Ze=class Ze extends _{constructor(){super(...arguments),this.day="",this.calories="",this.protein="",this.carbs="",this.fat=""}render(){return c`
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
    `}};Ze.styles=[$.styles,w`
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
    `];let j=Ze;Rt([A()],j.prototype,"day");Rt([A()],j.prototype,"calories");Rt([A()],j.prototype,"protein");Rt([A()],j.prototype,"carbs");Rt([A()],j.prototype,"fat");var Pn=Object.defineProperty,Er=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Pn(t,e,s),s};const Qe=class Qe extends _{constructor(){super(...arguments),this.href="",this.title=""}render(){return c`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `}};Qe.styles=[$.styles,w`
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
    `];let St=Qe;Er([A()],St.prototype,"href");Er([A()],St.prototype,"title");var Cn=Object.defineProperty,On=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Cn(t,e,s),s};const Xe=class Xe extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/mealplans/public",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.mealPlans=t}).catch(t=>console.error("Error fetching meal plan:",t))}renderPlanList(){var t;return this.mealPlans?c`
      <ul>
        ${(t=this.mealPlans)==null?void 0:t.map(e=>c`
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
    `:c`Loading meal plans...`}render(){return c`
      <mpn-header
          title="Public Meal Plan Library"
      ></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>
    `}};Xe.styles=[$.styles,w`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Yt=Xe;On([b()],Yt.prototype,"mealPlans");var Tn=Object.defineProperty,Nn=Object.getOwnPropertyDescriptor,Sr=(i,t,e,r)=>{for(var s=r>1?void 0:r?Nn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=(r?o(t,e,s):o(s))||s);return r&&s&&Tn(t,e,s),s};const Qt=class Qt extends Ue{constructor(){super("mpn:model"),this.editing=!1}get user(){return this.model.profile}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["profile/get",{username:"bleh"}])}async setAsCurrent(t){if(!this.user||!confirm("Set this meal plan as your current one?"))return;const r={currentMealPlan:t};this.dispatchMessage(["profile/save",{profile:r}])}renderMealPlans(){var t,e;return(e=(t=this.user)==null?void 0:t.mealPlans)!=null&&e.length?c`
      <ul>
        ${this.user.mealPlans.map(r=>{var s,n;return c`
            <li>
              <span>${r.name}</span>
              ${((n=(s=this.user)==null?void 0:s.currentMealPlan)==null?void 0:n._id)===r._id?c`<em>(Current)</em>`:c` <button @click=${()=>this.setAsCurrent(r._id)}>Set as Current</button> `}
            </li>
          `})}
      </ul>
    `:c`<p>You haven't created any meal plans yet.</p>`}handleSubmit(t){this.dispatchMessage(["profile/save",{profile:t.detail,onSuccess:()=>{this.editing=!1},onFailure:e=>{console.error("Save failed:",e)}}])}render(){return c`
    <mpn-header title="My Profile"></mpn-header>
    <mpn-main-grid>
      <mpn-card class="col-span-12">
        <h2>Profile Info</h2>
        ${this.user?c`
              <div class="info-block">
                <p><span class="label">First Name:</span> ${this.user.firstName}</p>
                <p><span class="label">Last Name:</span> ${this.user.lastName}</p>
                <p><span class="label">Username:</span> ${this.user.username}</p>
              </div>

              <button @click=${()=>this.editing=!this.editing}>
                ${this.editing?"Cancel":"Edit Name"}
              </button>

              ${this.editing?c`
                    <mu-form
                      .init=${{firstName:this.user.firstName,lastName:this.user.lastName}}
                      @mu-form:submit=${this.handleSubmit}
                    >
                      <label>
                        First Name:
                        <input name="firstName" required />
                      </label>
                      <label>
                        Last Name:
                        <input name="lastName" required />
                      </label>
                    </mu-form>
                  `:""}

              <div class="info-block">
                <h3>Current Meal Plan</h3>
                ${this.user.currentMealPlan?c`
                      <p>
                        <a href="/app/my-plans/${this.user.currentMealPlan._id}">
                          ${this.user.currentMealPlan.name}
                        </a>
                      </p>
                    `:c`<p>No meal plan selected.</p>`}
              </div>

              <div class="info-block">
                <h3>Your Meal Plans</h3>
                ${this.renderMealPlans()}
              </div>
            `:c`<p>Loading user info...</p>`}
      </mpn-card>

      <mpn-card class="col-span-12 signout-container">
        <button
          @click=${t=>Vr.relay(t,"auth:message",["auth/signout",{redirect:"/"}])}
        >
          <svg class="icon">
            <use href="/icons/nutrition.svg#icon-profile" />
          </svg>
          Sign Out
        </button>
      </mpn-card>
    </mpn-main-grid>
  `}};Qt.uses=Me({"mu-form":Ws.Element}),Qt.styles=[$.styles,w`
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
      mu-form {
        display: flex;
        gap: 1rem;
      }
    `];let xt=Qt;Sr([b()],xt.prototype,"user",1);Sr([b()],xt.prototype,"editing",2);var Rn=Object.defineProperty,Mn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Rn(t,e,s),s};const Ge=class Ge extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/recipes/public",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.recipes=t}).catch(t=>console.error("Error fetching recipes:",t))}renderRecipeList(){return this.recipes?c`
      <ul>
        ${this.recipes.map(t=>c`
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
    `:c`Loading recipes...`}render(){return c`
      <mpn-header title="Public Recipe Library"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderRecipeList()}
        </section>
      </mpn-main-grid>
    `}};Ge.styles=[$.styles,w`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Jt=Ge;Mn([b()],Jt.prototype,"recipes");const ts=class ts extends _{render(){return c`
      <mpn-header title="Create Account"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12 center-content">
          <div class="sequence">
            <h2>Sign Up</h2>
            <signup-form api="/auth/register" redirect="/">
              <label>
                <span>Username:</span>
                <input name="username" autocomplete="off" />
              </label>
              <label>
                <span>Password:</span>
                <input type="password" name="password" />
              </label>
            </signup-form>
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
    `}};ts.styles=[$.styles,w`
      mpn-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
      }
    `];let Se=ts;var Un=Object.defineProperty,xr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Un(t,e,s),s};const es=class es extends _{constructor(){super(...arguments),this.id="",this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{var e;this._user=t.user,(e=this._user)!=null&&e.authenticated&&this.fetchRecipe()})}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async fetchRecipe(){try{const t=await fetch(`/api/recipes/${this.id}`,{headers:this.authorization});if(!t.ok)throw new Error(`HTTP ${t.status}`);this.recipe=await t.json()}catch(t){console.error("Failed to fetch recipe:",t)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((t,e)=>(t.calories+=e.calories||0,t.protein+=e.protein||0,t.carbs+=e.carbs||0,t.fat+=e.fat||0,t),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){return c`
      <mpn-header title="Recipe Details"></mpn-header>
      ${this.recipe?this.renderDetails():c`<p style="padding: var(--space-md)">Loading recipe...</p>`}
    `}renderDetails(){const t=this.computeNutrition();return c`
      <mpn-main-grid>
        <mpn-card class="col-span-6">
          <h2>Ingredients</h2>
          <ul>
            ${this.recipe.ingredients.map(e=>c`
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
            ${this.recipe.steps.map(e=>c`<li>${e}</li>`)}
          </ol>
        </mpn-card>
      </mpn-main-grid>
    `}};es.styles=[$.styles,w`
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
    `];let kt=es;xr([A({type:String})],kt.prototype,"id");xr([b()],kt.prototype,"recipe");var jn=Object.defineProperty,kr=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&jn(t,e,s),s};const ss=class ss extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(t){try{const e=await fetch(t,{headers:this.authorization});this.recipe=await e.json()}catch(e){console.error("Failed to fetch recipe:",e)}}computeNutrition(){return this.recipe?this.recipe.ingredients.reduce((t,e)=>(t.calories+=e.calories||0,t.protein+=e.protein||0,t.carbs+=e.carbs||0,t.fat+=e.fat||0,t),{calories:0,protein:0,carbs:0,fat:0}):{calories:0,protein:0,carbs:0,fat:0}}render(){if(!this.recipe)return c`<p>Loading recipe...</p>`;const t=this.computeNutrition();return c`
      <mpn-main-grid>
        <mpn-card class="col-span-6">
          <h2>Ingredients</h2>
          <mpn-ingredients-list>
            ${this.recipe.ingredients.map(e=>c`<li>
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
            ${this.recipe.steps.map(e=>c`<li>${e}</li>`)}
          </ol>
        </mpn-card>
      </mpn-main-grid>
    `}};ss.styles=[$.styles,w`
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
    `];let Pt=ss;kr([A()],Pt.prototype,"src");kr([b()],Pt.prototype,"recipe");var Ln=Object.defineProperty,In=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ln(t,e,s),s};const rs=class rs extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/mealplans/private",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.mealPlans=t}).catch(t=>console.error("Error fetching personal meal plans:",t))}renderPlanList(){return this.mealPlans?c`
      <ul>
        ${this.mealPlans.map(t=>c`
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
    `:c`Loading your meal plans...`}render(){return c`
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
    `}};rs.styles=[$.styles,w`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Kt=rs;In([b()],Kt.prototype,"mealPlans");var zn=Object.defineProperty,Dn=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&zn(t,e,s),s};const is=class is extends _{constructor(){super(...arguments),this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/recipes/private",{headers:this.authorization}).then(t=>t.json()).then(t=>{this.recipes=t}).catch(t=>console.error("Error fetching personal recipes:",t))}renderRecipeList(){return this.recipes?c`
      <ul>
        ${this.recipes.map(t=>c`
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
    `:c`Loading your recipes...`}render(){return c`
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
    `}};is.styles=[$.styles,w`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
      }
    `];let Zt=is;Dn([b()],Zt.prototype,"recipes");const Hn={};function Bn(i,t,e){switch(i[0]){case"profile/get":Fn(e).then(r=>t(s=>({...s,profile:r})));break;case"profile/save":qn(i[1],e).then(r=>{var s,n;t(o=>({...o,profile:r})),(n=(s=i[1]).onSuccess)==null||n.call(s)}).catch(r=>{var s,n;(n=(s=i[1]).onFailure)==null||n.call(s,r)});break;case"mealplan/create":Vn(i[1],e).then(r=>{var s,n;(n=(s=i[1]).onSuccess)==null||n.call(s,r._id)}).catch(r=>{var s,n;(n=(s=i[1]).onFailure)==null||n.call(s,r)});break;default:throw new Error(`Unhandled Auth message "${i[0]}"`)}}function Fn(i){return console.log(i.username),fetch(`/api/users/${i.username}`,{headers:Gt.headers(i)}).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Profile:",t),t})}function qn(i,t){return fetch(`/api/users/${t.username}`,{method:"PUT",headers:{"Content-Type":"application/json",...Gt.headers(t)},body:JSON.stringify(i.profile)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}function Vn(i,t){return fetch("/api/mealplans",{method:"POST",headers:{"Content-Type":"application/json",...Gt.headers(t)},body:JSON.stringify(i.mealplan)}).then(e=>{if(e.status===201)return e.json();throw new Error("Failed to create meal plan")})}var Wn=Object.defineProperty,ie=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Wn(t,e,s),s};const Xt=class Xt extends Ue{constructor(){super("mpn:model"),this.name="",this.isPublic=!1,this.days=[],this.recipes=[],this._authObserver=new k(this,"mpn:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.hydrate()})}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}async hydrate(){fetch("/api/recipes",{headers:this.authorization}).then(t=>{if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}).then(t=>{this.recipes=t}).catch(t=>{console.error("Error fetching recipes:",t)})}addDay(){this.days=[...this.days,{weekday:"",recipes:[]}]}updateDay(t,e,r){this.days=this.days.map((s,n)=>n===t?{...s,[e]:r}:s)}handleSubmit(){const t=this.days.map(r=>({weekday:r.weekday,recipes:r.recipes.map(s=>typeof s=="string"?s:s._id)})),e={name:this.name,public:this.isPublic,days:t};this.dispatchMessage(["mealplan/create",{mealplan:e,onSuccess:r=>{location.assign(`/app/my-plans/${r}`)},onFailure:r=>{console.error("Meal plan creation failed:",r)}}])}render(){return c`
      <mpn-header title="Create Meal Plan"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <mu-form @mu-form:submit=${this.handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                .value=${this.name}
                @input=${t=>this.name=t.target.value}
                required
              />
            </label>

            <label>
              <input
                type="checkbox"
                .checked=${this.isPublic}
                @change=${t=>this.isPublic=t.target.checked}
              />
              Make plan public
            </label>

            ${this.days.map((t,e)=>c`
                <mpn-card>
                  <label>
                    Weekday:
                    <input
                      type="text"
                      name="weekday-${e}"
                      .value=${t.weekday}
                      @input=${r=>this.updateDay(e,"weekday",r.target.value)}
                    />
                  </label>

                  <label>
                    Recipes:
                    <select
                      multiple
                      @change=${r=>{const s=Array.from(r.target.selectedOptions).map(o=>o.value),n=this.recipes.filter(o=>s.includes(o._id));this.updateDay(e,"recipes",n.map(o=>o._id))}}
                    >
                      ${this.recipes.map(r=>c`<option value=${r._id}>${r.name}</option>`)}
                    </select>
                  </label>
                </mpn-card>
              `)}

            </mu-form>
          <button type="button" @click=${this.addDay}>Add Day</button>
        </mpn-card>
      </mpn-main-grid>
    `}};Xt.uses=Me({"mu-form":Ws.Element}),Xt.styles=[$.styles,w`
      label {
        display: block;
        margin-bottom: 1rem;
      }

      select {
        width: 100%;
      }

      button {
        font: inherit;
        margin-top: var(--space-sm);
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: #c75c1d;
      }
    `];let J=Xt;ie([b()],J.prototype,"name");ie([b()],J.prototype,"isPublic");ie([b()],J.prototype,"days");ie([b()],J.prototype,"recipes");var Yn=Object.defineProperty,ne=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Yn(t,e,s),s};const ns=class ns extends _{constructor(){super(...arguments),this.formData={},this.api="/auth/register",this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return c`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Sign Up</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,r=e==null?void 0:e.name,s=e==null?void 0:e.value,n=this.formData;switch(r){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==201)throw"Signup failed";return e.json()}).then(({token:e})=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{console.error(e),this.error=e.toString()})}};ns.styles=[$.styles,w`
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
    `];let K=ns;ne([b()],K.prototype,"formData");ne([A()],K.prototype,"api");ne([A()],K.prototype,"redirect");ne([b()],K.prototype,"error");const Jn=[{path:"/",redirect:"/app"},{path:"/app",view:()=>c`<home-view></home-view>`},{path:"/app/login",view:()=>c`<login-view></login-view>`},{path:"/app/sign-up",view:()=>c`<signup-view></signup-view>`},{path:"/app/profile",view:()=>c`<profile-view></profile-view>`},{path:"/app/my-plans",view:()=>c`<my-plans-view></my-plans-view>`},{path:"/app/my-plans/create",view:()=>c`<create-plan-view></create-plan-view>`},{path:"/app/my-recipes",view:()=>c`<my-recipes-view></my-recipes-view>`},{path:"/app/my-recipes/create",view:()=>c`<create-recipe-view></create-plan-view>`},{path:"/app/my-plans/:id",view:i=>c`
      <plan-view id=${i.id}></plan-view>
    `},{path:"/app/my-recipes/:id",view:i=>c`
      <recipe-view id=${i.id}></recipe-view>
    `},{path:"/app/discover",redirect:"/app/discover/plans"},{path:"/app/discover/plans",view:()=>c` <shared-plans-view></shared-plans-view> `},{path:"/app/discover/plans/:id",view:i=>c`
      <plan-view id=${i.id}></plan-view>
    `},{path:"/app/discover/recipes",view:()=>c`<shared-recipes-view></shared-recipes-view>`},{path:"/app/discover/recipes/:id",view:i=>c`
      <recipe-view id=${i.id}></recipe-view>
    `}];Me({"mu-auth":Gt.Provider,"mu-history":Xr.Provider,"mu-store":class extends ei.Provider{constructor(){super(Bn,Hn,"mpn:auth")}},"mpn-header":U,"mpn-card":we,"mpn-main-grid":Ae,"mpn-button-link":Vt,"mpn-meal-plan":Wt,"mpn-meal-day":j,"mpn-recipe-link":St,"login-form":Y,"mpn-recipe-details":Pt,"signup-form":K,"home-view":ht,"login-view":Ee,"plan-view":Et,"shared-plans-view":Yt,"profile-view":xt,"shared-recipes-view":Jt,"signup-view":Se,"recipe-view":kt,"my-plans-view":Kt,"my-recipes-view":Zt,"create-plan-view":J,"mu-switch":class extends qi.Element{constructor(){super(Jn,"mpn:history","mpn:auth")}}});
