"use strict";(self.webpackChunknasa_images=self.webpackChunknasa_images||[]).push([[796],{2796:(me,M,s)=>{s.r(M),s.d(M,{NasaImagesFaqsFeatureComponent:()=>B,nasaImagesFaqsFeatureRoutes:()=>ge});var g=s(6814),e=s(5879),C=s(8337),m=s(2495),x=s(8645),w=s(7394);let q=0;const _=new e.OlP("CdkAccordion");let R=(()=>{var n;class o{constructor(){this._stateChanges=new x.x,this._openCloseAllActions=new x.x,this.id="cdk-accordion-"+q++,this._multi=!1}get multi(){return this._multi}set multi(t){this._multi=(0,m.Ig)(t)}openAll(){this._multi&&this._openCloseAllActions.next(!0)}closeAll(){this._openCloseAllActions.next(!1)}ngOnChanges(t){this._stateChanges.next(t)}ngOnDestroy(){this._stateChanges.complete(),this._openCloseAllActions.complete()}}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275dir=e.lG2({type:n,selectors:[["cdk-accordion"],["","cdkAccordion",""]],inputs:{multi:"multi"},exportAs:["cdkAccordion"],features:[e._Bn([{provide:_,useExisting:n}]),e.TTD]}),o})(),Y=0,Z=(()=>{var n;class o{get expanded(){return this._expanded}set expanded(t){t=(0,m.Ig)(t),this._expanded!==t&&(this._expanded=t,this.expandedChange.emit(t),t?(this.opened.emit(),this._expansionDispatcher.notify(this.id,this.accordion?this.accordion.id:this.id)):this.closed.emit(),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled}set disabled(t){this._disabled=(0,m.Ig)(t)}constructor(t,a,r){this.accordion=t,this._changeDetectorRef=a,this._expansionDispatcher=r,this._openCloseAllSubscription=w.w0.EMPTY,this.closed=new e.vpe,this.opened=new e.vpe,this.destroyed=new e.vpe,this.expandedChange=new e.vpe,this.id="cdk-accordion-child-"+Y++,this._expanded=!1,this._disabled=!1,this._removeUniqueSelectionListener=()=>{},this._removeUniqueSelectionListener=r.listen((d,h)=>{this.accordion&&!this.accordion.multi&&this.accordion.id===h&&this.id!==d&&(this.expanded=!1)}),this.accordion&&(this._openCloseAllSubscription=this._subscribeToOpenCloseAllActions())}ngOnDestroy(){this.opened.complete(),this.closed.complete(),this.destroyed.emit(),this.destroyed.complete(),this._removeUniqueSelectionListener(),this._openCloseAllSubscription.unsubscribe()}toggle(){this.disabled||(this.expanded=!this.expanded)}close(){this.disabled||(this.expanded=!1)}open(){this.disabled||(this.expanded=!0)}_subscribeToOpenCloseAllActions(){return this.accordion._openCloseAllActions.subscribe(t=>{this.disabled||(this.expanded=t)})}}return(n=o).\u0275fac=function(t){return new(t||n)(e.Y36(_,12),e.Y36(e.sBO),e.Y36(C.A8))},n.\u0275dir=e.lG2({type:n,selectors:[["cdk-accordion-item"],["","cdkAccordionItem",""]],inputs:{expanded:"expanded",disabled:"disabled"},outputs:{closed:"closed",opened:"opened",destroyed:"destroyed",expandedChange:"expandedChange"},exportAs:["cdkAccordionItem"],features:[e._Bn([{provide:_,useValue:void 0}])]}),o})(),z=(()=>{var n;class o{}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({}),o})();var v=s(8484),E=s(3680),T=s(4300),L=s(3997),P=s(7921),u=s(2181),j=s(8180),b=s(6028),Q=s(6232),$=s(3019),l=s(6825);const U=["body"];function J(n,o){}const G=[[["mat-expansion-panel-header"]],"*",[["mat-action-row"]]],X=["mat-expansion-panel-header","*","mat-action-row"];function V(n,o){if(1&n&&e._UZ(0,"span",2),2&n){const i=e.oxw();e.Q6J("@indicatorRotate",i._getExpandedState())}}const K=[[["mat-panel-title"]],[["mat-panel-description"]],"*"],W=["mat-panel-title","mat-panel-description","*"],y=new e.OlP("MAT_ACCORDION"),I="225ms cubic-bezier(0.4,0.0,0.2,1)",D={indicatorRotate:(0,l.X$)("indicatorRotate",[(0,l.SB)("collapsed, void",(0,l.oB)({transform:"rotate(0deg)"})),(0,l.SB)("expanded",(0,l.oB)({transform:"rotate(180deg)"})),(0,l.eR)("expanded <=> collapsed, void => collapsed",(0,l.jt)(I))]),bodyExpansion:(0,l.X$)("bodyExpansion",[(0,l.SB)("collapsed, void",(0,l.oB)({height:"0px",visibility:"hidden"})),(0,l.SB)("expanded",(0,l.oB)({height:"*",visibility:""})),(0,l.eR)("expanded <=> collapsed, void => collapsed",(0,l.jt)(I))])},F=new e.OlP("MAT_EXPANSION_PANEL");let ee=(()=>{var n;class o{constructor(t,a){this._template=t,this._expansionPanel=a}}return(n=o).\u0275fac=function(t){return new(t||n)(e.Y36(e.Rgc),e.Y36(F,8))},n.\u0275dir=e.lG2({type:n,selectors:[["ng-template","matExpansionPanelContent",""]]}),o})(),te=0;const O=new e.OlP("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS");let H=(()=>{var n;class o extends Z{get hideToggle(){return this._hideToggle||this.accordion&&this.accordion.hideToggle}set hideToggle(t){this._hideToggle=(0,m.Ig)(t)}get togglePosition(){return this._togglePosition||this.accordion&&this.accordion.togglePosition}set togglePosition(t){this._togglePosition=t}constructor(t,a,r,d,h,A,f){super(t,a,r),this._viewContainerRef=d,this._animationMode=A,this._hideToggle=!1,this.afterExpand=new e.vpe,this.afterCollapse=new e.vpe,this._inputChanges=new x.x,this._headerId="mat-expansion-panel-header-"+te++,this._bodyAnimationDone=new x.x,this.accordion=t,this._document=h,this._bodyAnimationDone.pipe((0,L.x)((c,p)=>c.fromState===p.fromState&&c.toState===p.toState)).subscribe(c=>{"void"!==c.fromState&&("expanded"===c.toState?this.afterExpand.emit():"collapsed"===c.toState&&this.afterCollapse.emit())}),f&&(this.hideToggle=f.hideToggle)}_hasSpacing(){return!!this.accordion&&this.expanded&&"default"===this.accordion.displayMode}_getExpandedState(){return this.expanded?"expanded":"collapsed"}toggle(){this.expanded=!this.expanded}close(){this.expanded=!1}open(){this.expanded=!0}ngAfterContentInit(){this._lazyContent&&this._lazyContent._expansionPanel===this&&this.opened.pipe((0,P.O)(null),(0,u.h)(()=>this.expanded&&!this._portal),(0,j.q)(1)).subscribe(()=>{this._portal=new v.UE(this._lazyContent._template,this._viewContainerRef)})}ngOnChanges(t){this._inputChanges.next(t)}ngOnDestroy(){super.ngOnDestroy(),this._bodyAnimationDone.complete(),this._inputChanges.complete()}_containsFocus(){if(this._body){const t=this._document.activeElement,a=this._body.nativeElement;return t===a||a.contains(t)}return!1}}return(n=o).\u0275fac=function(t){return new(t||n)(e.Y36(y,12),e.Y36(e.sBO),e.Y36(C.A8),e.Y36(e.s_b),e.Y36(g.K0),e.Y36(e.QbO,8),e.Y36(O,8))},n.\u0275cmp=e.Xpm({type:n,selectors:[["mat-expansion-panel"]],contentQueries:function(t,a,r){if(1&t&&e.Suo(r,ee,5),2&t){let d;e.iGM(d=e.CRH())&&(a._lazyContent=d.first)}},viewQuery:function(t,a){if(1&t&&e.Gf(U,5),2&t){let r;e.iGM(r=e.CRH())&&(a._body=r.first)}},hostAttrs:[1,"mat-expansion-panel"],hostVars:6,hostBindings:function(t,a){2&t&&e.ekj("mat-expanded",a.expanded)("_mat-animation-noopable","NoopAnimations"===a._animationMode)("mat-expansion-panel-spacing",a._hasSpacing())},inputs:{disabled:"disabled",expanded:"expanded",hideToggle:"hideToggle",togglePosition:"togglePosition"},outputs:{opened:"opened",closed:"closed",expandedChange:"expandedChange",afterExpand:"afterExpand",afterCollapse:"afterCollapse"},exportAs:["matExpansionPanel"],features:[e._Bn([{provide:y,useValue:void 0},{provide:F,useExisting:n}]),e.qOj,e.TTD],ngContentSelectors:X,decls:7,vars:4,consts:[["role","region",1,"mat-expansion-panel-content",3,"id"],["body",""],[1,"mat-expansion-panel-body"],[3,"cdkPortalOutlet"]],template:function(t,a){1&t&&(e.F$t(G),e.Hsn(0),e.TgZ(1,"div",0,1),e.NdJ("@bodyExpansion.done",function(d){return a._bodyAnimationDone.next(d)}),e.TgZ(3,"div",2),e.Hsn(4,1),e.YNc(5,J,0,0,"ng-template",3),e.qZA(),e.Hsn(6,2),e.qZA()),2&t&&(e.xp6(1),e.Q6J("@bodyExpansion",a._getExpandedState())("id",a.id),e.uIk("aria-labelledby",a._headerId),e.xp6(4),e.Q6J("cdkPortalOutlet",a._portal))},dependencies:[v.Pl],styles:['.mat-expansion-panel{--mat-expansion-container-shape:4px;box-sizing:content-box;display:block;margin:0;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative;background:var(--mat-expansion-container-background-color);color:var(--mat-expansion-container-text-color);border-radius:var(--mat-expansion-container-shape)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:var(--mat-expansion-container-shape);border-top-left-radius:var(--mat-expansion-container-shape)}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:var(--mat-expansion-container-shape);border-bottom-left-radius:var(--mat-expansion-container-shape)}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible;font-family:var(--mat-expansion-container-text-font);font-size:var(--mat-expansion-container-text-size);font-weight:var(--mat-expansion-container-text-weight);line-height:var(--mat-expansion-container-text-line-height);letter-spacing:var(--mat-expansion-container-text-tracking)}.mat-expansion-panel-content[style*="visibility: hidden"] *{visibility:hidden !important}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;border-top-color:var(--mat-expansion-actions-divider-color)}.mat-action-row .mat-button-base,.mat-action-row .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row .mat-button-base,[dir=rtl] .mat-action-row .mat-mdc-button-base{margin-left:0;margin-right:8px}'],encapsulation:2,data:{animation:[D.bodyExpansion]},changeDetection:0}),o})();class ne{}const ae=(0,E.sb)(ne);let k=(()=>{var n;class o extends ae{constructor(t,a,r,d,h,A,f){super(),this.panel=t,this._element=a,this._focusMonitor=r,this._changeDetectorRef=d,this._animationMode=A,this._parentChangeSubscription=w.w0.EMPTY;const c=t.accordion?t.accordion._stateChanges.pipe((0,u.h)(p=>!(!p.hideToggle&&!p.togglePosition))):Q.E;this.tabIndex=parseInt(f||"")||0,this._parentChangeSubscription=(0,$.T)(t.opened,t.closed,c,t._inputChanges.pipe((0,u.h)(p=>!!(p.hideToggle||p.disabled||p.togglePosition)))).subscribe(()=>this._changeDetectorRef.markForCheck()),t.closed.pipe((0,u.h)(()=>t._containsFocus())).subscribe(()=>r.focusVia(a,"program")),h&&(this.expandedHeight=h.expandedHeight,this.collapsedHeight=h.collapsedHeight)}get disabled(){return this.panel.disabled}_toggle(){this.disabled||this.panel.toggle()}_isExpanded(){return this.panel.expanded}_getExpandedState(){return this.panel._getExpandedState()}_getPanelId(){return this.panel.id}_getTogglePosition(){return this.panel.togglePosition}_showToggle(){return!this.panel.hideToggle&&!this.panel.disabled}_getHeaderHeight(){const t=this._isExpanded();return t&&this.expandedHeight?this.expandedHeight:!t&&this.collapsedHeight?this.collapsedHeight:null}_keydown(t){switch(t.keyCode){case b.L_:case b.K5:(0,b.Vb)(t)||(t.preventDefault(),this._toggle());break;default:return void(this.panel.accordion&&this.panel.accordion._handleHeaderKeydown(t))}}focus(t,a){t?this._focusMonitor.focusVia(this._element,t,a):this._element.nativeElement.focus(a)}ngAfterViewInit(){this._focusMonitor.monitor(this._element).subscribe(t=>{t&&this.panel.accordion&&this.panel.accordion._handleHeaderFocus(this)})}ngOnDestroy(){this._parentChangeSubscription.unsubscribe(),this._focusMonitor.stopMonitoring(this._element)}}return(n=o).\u0275fac=function(t){return new(t||n)(e.Y36(H,1),e.Y36(e.SBq),e.Y36(T.tE),e.Y36(e.sBO),e.Y36(O,8),e.Y36(e.QbO,8),e.$8M("tabindex"))},n.\u0275cmp=e.Xpm({type:n,selectors:[["mat-expansion-panel-header"]],hostAttrs:["role","button",1,"mat-expansion-panel-header","mat-focus-indicator"],hostVars:15,hostBindings:function(t,a){1&t&&e.NdJ("click",function(){return a._toggle()})("keydown",function(d){return a._keydown(d)}),2&t&&(e.uIk("id",a.panel._headerId)("tabindex",a.tabIndex)("aria-controls",a._getPanelId())("aria-expanded",a._isExpanded())("aria-disabled",a.panel.disabled),e.Udp("height",a._getHeaderHeight()),e.ekj("mat-expanded",a._isExpanded())("mat-expansion-toggle-indicator-after","after"===a._getTogglePosition())("mat-expansion-toggle-indicator-before","before"===a._getTogglePosition())("_mat-animation-noopable","NoopAnimations"===a._animationMode))},inputs:{tabIndex:"tabIndex",expandedHeight:"expandedHeight",collapsedHeight:"collapsedHeight"},features:[e.qOj],ngContentSelectors:W,decls:5,vars:3,consts:[[1,"mat-content"],["class","mat-expansion-indicator",4,"ngIf"],[1,"mat-expansion-indicator"]],template:function(t,a){1&t&&(e.F$t(K),e.TgZ(0,"span",0),e.Hsn(1),e.Hsn(2,1),e.Hsn(3,2),e.qZA(),e.YNc(4,V,1,1,"span",1)),2&t&&(e.ekj("mat-content-hide-toggle",!a._showToggle()),e.xp6(4),e.Q6J("ngIf",a._showToggle()))},dependencies:[g.O5],styles:['.mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;transition:height 225ms cubic-bezier(0.4, 0, 0.2, 1);height:var(--mat-expansion-header-collapsed-state-height);font-family:var(--mat-expansion-header-text-font);font-size:var(--mat-expansion-header-text-size);font-weight:var(--mat-expansion-header-text-weight);line-height:var(--mat-expansion-header-text-line-height);letter-spacing:var(--mat-expansion-header-text-tracking)}.mat-expansion-panel-header.mat-expanded{height:var(--mat-expansion-header-expanded-state-height)}.mat-expansion-panel-header[aria-disabled=true]{color:var(--mat-expansion-header-disabled-state-text-color)}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-header-hover-state-layer-color)}@media(hover: none){.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover{background:var(--mat-expansion-container-background-color)}}.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused,.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused{background:var(--mat-expansion-header-focus-state-layer-color)}.mat-expansion-panel-header._mat-animation-noopable{transition:none}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-content.mat-content-hide-toggle{margin-right:8px}[dir=rtl] .mat-content.mat-content-hide-toggle{margin-right:0;margin-left:8px}.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-left:24px;margin-right:0}[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle{margin-right:24px;margin-left:0}.mat-expansion-panel-header-title{color:var(--mat-expansion-header-text-color)}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;flex-basis:0;margin-right:16px;align-items:center}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description{color:inherit}.mat-expansion-panel-header-description{flex-grow:2;color:var(--mat-expansion-header-description-color)}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:"";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle;color:var(--mat-expansion-header-indicator-color)}.cdk-high-contrast-active .mat-expansion-panel-content{border-top:1px solid;border-top-left-radius:0;border-top-right-radius:0}'],encapsulation:2,data:{animation:[D.indicatorRotate]},changeDetection:0}),o})(),ie=(()=>{var n;class o{}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275dir=e.lG2({type:n,selectors:[["mat-panel-description"]],hostAttrs:[1,"mat-expansion-panel-header-description"]}),o})(),oe=(()=>{var n;class o{}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275dir=e.lG2({type:n,selectors:[["mat-panel-title"]],hostAttrs:[1,"mat-expansion-panel-header-title"]}),o})(),se=(()=>{var n;class o extends R{constructor(){super(...arguments),this._ownHeaders=new e.n_E,this._hideToggle=!1,this.displayMode="default",this.togglePosition="after"}get hideToggle(){return this._hideToggle}set hideToggle(t){this._hideToggle=(0,m.Ig)(t)}ngAfterContentInit(){this._headers.changes.pipe((0,P.O)(this._headers)).subscribe(t=>{this._ownHeaders.reset(t.filter(a=>a.panel.accordion===this)),this._ownHeaders.notifyOnChanges()}),this._keyManager=new T.Em(this._ownHeaders).withWrap().withHomeAndEnd()}_handleHeaderKeydown(t){this._keyManager.onKeydown(t)}_handleHeaderFocus(t){this._keyManager.updateActiveItem(t)}ngOnDestroy(){super.ngOnDestroy(),this._keyManager?.destroy(),this._ownHeaders.destroy()}}return(n=o).\u0275fac=function(){let i;return function(a){return(i||(i=e.n5z(n)))(a||n)}}(),n.\u0275dir=e.lG2({type:n,selectors:[["mat-accordion"]],contentQueries:function(t,a,r){if(1&t&&e.Suo(r,k,5),2&t){let d;e.iGM(d=e.CRH())&&(a._headers=d)}},hostAttrs:[1,"mat-accordion"],hostVars:2,hostBindings:function(t,a){2&t&&e.ekj("mat-accordion-multi",a.multi)},inputs:{multi:"multi",hideToggle:"hideToggle",displayMode:"displayMode",togglePosition:"togglePosition"},exportAs:["matAccordion"],features:[e._Bn([{provide:y,useExisting:n}]),e.qOj]}),o})(),re=(()=>{var n;class o{}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[g.ez,E.BQ,z,v.eL]}),o})();var S=s(617),de=s(8091),le=s(1629),pe=s(9862);let N=(()=>{var n;class o{constructor(){this.httpClient=(0,e.f3M)(pe.eN)}getList(){return this.httpClient.get("assets/json/faqs.json")}}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac}),o})();function ce(n,o){if(1&n&&(e.TgZ(0,"h2",4)(1,"mat-icon"),e._uU(2),e.qZA(),e.TgZ(3,"span"),e._uU(4),e.qZA()()),2&n){const i=o.ngIf;e.xp6(2),e.hij(" ",i.icon," "),e.xp6(2),e.Oqu(i.title)}}function he(n,o){if(1&n&&(e.TgZ(0,"mat-expansion-panel",5)(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"p",6),e._uU(4),e.qZA()(),e._UZ(5,"mat-panel-description"),e.qZA(),e._UZ(6,"div",7),e.qZA()),2&n){const i=o.$implicit;e.xp6(4),e.Oqu(i.question),e.xp6(2),e.Q6J("innerHTML",i.answer,e.oJD)}}let B=(()=>{var n;class o{constructor(){this.routeInfo$=(0,e.f3M)(le.W).routeInfo$,this.faqs$=(0,e.f3M)(N).getList()}trackFaqs(t){return t}}return(n=o).\u0275fac=function(t){return new(t||n)},n.\u0275cmp=e.Xpm({type:n,selectors:[["plastik-nasa-images-faqs-feature"]],standalone:!0,features:[e.jDz],decls:6,vars:7,consts:[["class","flex items-center gap-sm h3","data-test","page-title",4,"ngIf"],[1,"faqs-wrapper"],[1,"mx-xl","my-md"],["data-test","faq-item",4,"ngFor","ngForOf","ngForTrackBy"],["data-test","page-title",1,"flex","items-center","gap-sm","h3"],["data-test","faq-item"],["data-test","faq-question",1,"h5"],["data-test","faq-answer",3,"innerHTML"]],template:function(t,a){1&t&&(e.YNc(0,ce,5,2,"h2",0),e.ALo(1,"ngrxPush"),e.TgZ(2,"section",1)(3,"mat-accordion",2),e.YNc(4,he,7,2,"mat-expansion-panel",3),e.ALo(5,"ngrxPush"),e.qZA()()),2&t&&(e.Q6J("ngIf",e.lcZ(1,3,a.routeInfo$)),e.xp6(4),e.Q6J("ngForOf",e.lcZ(5,5,a.faqs$))("ngForTrackBy",a.trackFaqs))},dependencies:[g.ax,g.O5,re,se,H,k,oe,ie,S.Ps,S.Hw,de.fM],styles:["[_nghost-%COMP%]     .faqs-wrapper .mat-expansion-panel .mat-expansion-panel-header .mat-content{display:block}@media (min-width: 1024px){[_nghost-%COMP%]     .faqs-wrapper .mat-expansion-panel .mat-expansion-panel-header .mat-content{display:flex}[_nghost-%COMP%]     .faqs-wrapper .mat-expansion-panel .mat-expansion-panel-header .mat-content .mat-expansion-panel-header-title{flex-grow:3}}[_nghost-%COMP%]     .faqs-wrapper .mat-expansion-panel .mat-expansion-panel-body .highlight{font-weight:600}"]}),o})();const ge=[{path:"",data:{name:"faqs"},title:"FAQs",component:B,providers:[N]}]}}]);