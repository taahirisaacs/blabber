(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{133:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(43),l=a.n(o);a(77),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var s=a(17),u=a(28),c=(a(78),a(44)),i=a.n(c),m=a(45),d=a.n(m),h=a(37),p=a.n(h),f=a(22),b=a.n(f),E=a(33),g=a.n(E),v=r.a.createContext(null),O=function(e){return function(t){return r.a.createElement(v.Consumer,null,function(a){return r.a.createElement(e,Object.assign({},t,{firebase:a}))})}},w=v,j=a(11),y=a(39),C=a.n(y),S=(a(79),a(80),{apiKey:"AIzaSyADOcMXveNYgHVM0fnDmC3356ImbmG37Ec",authDomain:"blabber-2fef9.firebaseapp.com",databaseURL:"https://blabber-2fef9.firebaseio.com",projectId:"blabber-2fef9",storageBucket:"blabber-2fef9.appspot.com",messagingSenderId:"1043356690661",appId:"1:1043356690661:web:5afc6b4602cda087"}),I=function e(){var t=this;Object(j.a)(this,e),this.doCreateUserWithEmailAndPassword=function(e,a){return t.auth.createUserWithEmailAndPassword(e,a)},this.doSignInWithEmailAndPassword=function(e,a){return t.auth.signInWithEmailAndPassword(e,a)},this.doSignOut=function(){return t.auth.signOut()},this.doPasswordReset=function(e){return t.auth.sendPasswordResetEmail(e)},this.doPasswordUpdate=function(e){return t.auth.currentUser.updatePassword(e)},this.user=function(e){return t.db.ref("users/".concat(e))},this.users=function(){return t.db.ref("users")},this.message=function(e){return t.db.ref("${uid}/messsage")},C.a.initializeApp(S),this.auth=C.a.auth(),this.db=C.a.database()},k=O(function(e){var t=e.firebase;return r.a.createElement("button",{type:"button",onClick:t.doSignOut},"Sign Out")}),P="/home",A=r.a.createContext(null),U=a(13),D=a(15),W=a(14),N=a(16),M=function(e){var t=function(t){function a(e){var t;return Object(j.a)(this,a),(t=Object(D.a)(this,Object(W.a)(a).call(this,e))).state={authUser:null},t}return Object(N.a)(a,t),Object(U.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.listener=this.props.firebase.auth.onAuthStateChanged(function(t){t?e.setState({authUser:t}):e.setState({authUser:null})})}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){return r.a.createElement(A.Provider,{value:this.state.authUser},r.a.createElement(e,this.props))}}]),a}(r.a.Component);return O(t)},T=a(24),x=function(e){return function(t){var a=function(a){function n(){return Object(j.a)(this,n),Object(D.a)(this,Object(W.a)(n).apply(this,arguments))}return Object(N.a)(n,a),Object(U.a)(n,[{key:"componentDidMount",value:function(){var t=this;this.listener=this.props.firebase.auth.onAuthStateChanged(function(a){e(a)||t.props.history.push("/signin")})}},{key:"componentWillUnmount",value:function(){this.listener()}},{key:"render",value:function(){var a=this;return r.a.createElement(A.Consumer,null,function(n){return e(n)?r.a.createElement(t,a.props):null})}}]),n}(r.a.Component);return Object(T.a)(u.d,O)(a)}},G=function(){return r.a.createElement(g.a,{sticky:"top",bg:"light",variant:"light"},r.a.createElement(g.a.Brand,{href:"/"},"Navbar"),r.a.createElement(b.a,{className:"justify-content-end",activeKey:P},r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:"/"},"Landing")),r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:P},"Home")),r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:"/account"},"Account")),r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:"/admin"},"Admin")),r.a.createElement(b.a.Item,null,r.a.createElement(k,null))))},B=function(){return r.a.createElement(g.a,{sticky:"top",bg:"light",variant:"light"},r.a.createElement(g.a.Brand,{href:"/"},"Navbar"),r.a.createElement(b.a,{className:"justify-content-end",activeKey:P},r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:"/"},"Landing")),r.a.createElement(b.a.Item,null,r.a.createElement(s.b,{to:"/signin"},"Sign In"))))},L=function(){return r.a.createElement("div",null,r.a.createElement(A.Consumer,null,function(e){return e?r.a.createElement(G,null):r.a.createElement(B,null)}))},R=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Landing"))},F=a(19),H=a(12),K=a(10),z=a.n(K),J=a(27),$=a.n(J),V={username:"",email:"",passwordOne:"",passwordTwo:"",error:null},X=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).onSubmit=function(e){var t=a.state,n=t.username,r=t.email,o=t.passwordOne;a.props.firebase.doCreateUserWithEmailAndPassword(r,o).then(function(e){return a.props.firebase.user(e.user.uid).set({username:n,email:r})}).then(function(e){a.setState(Object(H.a)({},V)),a.props.history.push(P)}).catch(function(e){a.setState({error:e})}),e.preventDefault()},a.onChange=function(e){a.setState(Object(F.a)({},e.target.name,e.target.value))},a.state=Object(H.a)({},V),a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"render",value:function(){var e=this.state,t=e.username,a=e.email,n=e.passwordOne,o=e.passwordTwo,l=e.error,s=n!==o||""===n||""===a||""===t;return r.a.createElement(z.a,{onSubmit:this.onSubmit},r.a.createElement(z.a.Group,{controlId:"formUsername"},r.a.createElement(z.a.Control,{name:"username",value:t,onChange:this.onChange,type:"text",placeholder:"Full Name"})),r.a.createElement(z.a.Group,{controlId:"formEmail"},r.a.createElement(z.a.Control,{name:"email",value:a,onChange:this.onChange,type:"text",placeholder:"Email Address"})),r.a.createElement(z.a.Group,{controlId:"formPassOne"},r.a.createElement(z.a.Control,{name:"passwordOne",value:n,onChange:this.onChange,type:"password",placeholder:"Password"})),r.a.createElement(z.a.Group,{controlId:"formPassTwo"},r.a.createElement(z.a.Control,{name:"passwordTwo",value:o,onChange:this.onChange,type:"password",placeholder:"Confirm Password"})),r.a.createElement($.a,{variant:"primary",disabled:s,type:"submit",block:!0},"Sign Up"),l&&r.a.createElement("p",null,l.message))}}]),t}(n.Component),Y=function(){return r.a.createElement("p",null,"Don't have an account? ",r.a.createElement(s.b,{to:"/signup"},"Sign Up"))},q=Object(T.a)(u.d,O)(X),Q=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Sign Up"),r.a.createElement(q,null))},Z={email:"",error:null},_=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).onSubmit=function(e){var t=a.state.email;a.props.firebase.doPasswordReset(t).then(function(){a.setState(Object(H.a)({},Z))}).catch(function(e){a.setState({error:e})}),e.preventDefault()},a.onChange=function(e){a.setState(Object(F.a)({},e.target.name,e.target.value))},a.state=Object(H.a)({},Z),a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"render",value:function(){var e=this.state,t=e.email,a=e.error,n=""===t;return r.a.createElement("form",{onSubmit:this.onSubmit},r.a.createElement("input",{name:"email",value:this.state.email,onChange:this.onChange,type:"text",placeholder:"Email Address"}),r.a.createElement("button",{disabled:n,type:"submit"},"Reset My Password"),a&&r.a.createElement("p",null,a.message))}}]),t}(n.Component),ee=function(){return r.a.createElement("p",null,r.a.createElement(s.b,{to:"/pw-forget"},"Forgot Password?"))},te=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Password Forget"),r.a.createElement(ae,null))},ae=O(_),ne={email:"",password:"",error:null},re=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).onSubmit=function(e){var t=a.state,n=t.email,r=t.password;a.props.firebase.doSignInWithEmailAndPassword(n,r).then(function(){a.setState(Object(H.a)({},ne)),a.props.history.push(P)}).catch(function(e){a.setState({error:e})}),e.preventDefault()},a.onChange=function(e){a.setState(Object(F.a)({},e.target.name,e.target.value))},a.state=Object(H.a)({},ne),a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"render",value:function(){var e=this.state,t=e.email,a=e.password,n=e.error,o=""===a||""===t;return r.a.createElement(z.a,{onSubmit:this.onSubmit},r.a.createElement(z.a.Group,{controlId:"formEmail"},r.a.createElement(z.a.Control,{name:"email",value:t,onChange:this.onChange,type:"text",placeholder:"Email Address"})),r.a.createElement(z.a.Group,{controlId:"formPassword"},r.a.createElement(z.a.Control,{name:"password",value:a,onChange:this.onChange,type:"password",placeholder:"Password"})),r.a.createElement($.a,{variant:"primary",disabled:o,type:"submit",block:!0},"Sign In"),n&&r.a.createElement("p",null,n.message))}}]),t}(n.Component),oe=Object(T.a)(u.d,O)(re),le=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Login"),r.a.createElement(oe,null),r.a.createElement(ee,null),r.a.createElement(Y,null))},se=a(48),ue=a.n(se),ce=a(34),ie=a.n(ce),me={message:"",error:null},de=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).onSubmit=function(e){var t=a.state.message,n=ie.a.auth().currentUser,r=(new Date).getTime();ie.a.database().ref("messages/users/"+n.uid).push({message:t,timestamp:r}).then(function(e){a.setState(Object(H.a)({},me)),a.props.history.push(P)}).catch(function(e){a.setState({error:e})}),e.preventDefault()},a.onChange=function(e){a.setState(Object(F.a)({},e.target.name,e.target.value))},a.state=Object(H.a)({},me),a.state={datas:"",data:[],dataId:[]},a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"componentDidMount",value:function(){var e=this;ie.a.auth().onAuthStateChanged(function(t){t&&ie.a.database().ref("messages/users/"+t.uid).on("value",function(t){console.log(t),t.forEach(function(t){e.setState({dataId:e.state.dataId.concat([t.val().timestamp]),data:e.state.data.concat([t.val().message])})})})})}},{key:"render",value:function(){var e=this,t=this.state,a=t.message,n=t.error,o=""===a,l=this.state.dataId.map(function(t,a){return r.a.createElement("li",{className:"messages"},r.a.createElement("p",null,e.state.data[a]),r.a.createElement("span",{className:"timestamp"},new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"numeric",second:"numeric",year:"numeric",month:"long",day:"2-digit"}).format(t)))});return r.a.createElement("div",null,r.a.createElement("ul",null,l),r.a.createElement(z.a,{className:"FormInput",onSubmit:this.onSubmit},r.a.createElement(ue.a,{controlId:"formMessage"},r.a.createElement(z.a.Control,{name:"message",value:a,onChange:this.onChange,type:"text",placeholder:"Write a blab..."}),r.a.createElement(ue.a.Append,null,r.a.createElement($.a,{variant:"primary",disabled:o,type:"submit",block:!0},"Blabber"))),n&&r.a.createElement("p",null,n.message)))}}]),t}(n.Component),he=Object(T.a)(u.d,O)(de),pe=x(function(e){return!!e})(he,function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Home"),r.a.createElement("p",null,"The Home Page is accessible by every signed in user."))}),fe={passwordOne:"",passwordTwo:"",error:null},be=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).onSubmit=function(e){var t=a.state.passwordOne;a.props.firebase.doPasswordUpdate(t).then(function(){a.setState(Object(H.a)({},fe))}).catch(function(e){a.setState({error:e})}),e.preventDefault()},a.onChange=function(e){a.setState(Object(F.a)({},e.target.name,e.target.value))},a.state=Object(H.a)({},fe),a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"render",value:function(){var e=this.state,t=e.passwordOne,a=e.passwordTwo,n=e.error,o=t!==a||""===t;return r.a.createElement("form",{onSubmit:this.onSubmit},r.a.createElement("input",{name:"passwordOne",value:t,onChange:this.onChange,type:"password",placeholder:"New Password"}),r.a.createElement("input",{name:"passwordTwo",value:a,onChange:this.onChange,type:"password",placeholder:"Confirm New Password"}),r.a.createElement("button",{disabled:o,type:"submit"},"Reset My Password"),n&&r.a.createElement("p",null,n.message))}}]),t}(n.Component),Ee=O(be),ge=x(function(e){return!!e})(function(){return r.a.createElement(A.Consumer,null,function(e){return r.a.createElement("div",null,r.a.createElement("h1",null,"Account: ",e.email),r.a.createElement(ae,null),r.a.createElement(Ee,null))})}),ve=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(D.a)(this,Object(W.a)(t).call(this,e))).state={loading:!1,users:[]},a}return Object(N.a)(t,e),Object(U.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({loading:!0}),this.props.firebase.users().on("value",function(t){var a=t.val(),n=Object.keys(a).map(function(e){return Object(H.a)({},a[e],{uid:e})});e.setState({users:n,loading:!1})})}},{key:"componentWillUnmount",value:function(){this.props.firebase.users().off()}},{key:"render",value:function(){var e=this.state,t=e.users,a=e.loading;return r.a.createElement("div",null,r.a.createElement("h1",null,"Admin"),a&&r.a.createElement("div",null,"Loading ..."),r.a.createElement(Oe,{users:t}))}}]),t}(n.Component),Oe=function(e){var t=e.users;return r.a.createElement("ul",null,t.map(function(e){return r.a.createElement("li",{key:e.uid},r.a.createElement("span",null,r.a.createElement("strong",null,"ID:")," ",e.uid),r.a.createElement("span",null,r.a.createElement("strong",null,"E-Mail:")," ",e.email),r.a.createElement("span",null,r.a.createElement("strong",null,"Username:")," ",e.username))}))},we=x(function(e){return!!e})(ve),je=M(function(){return r.a.createElement(s.a,null,r.a.createElement(L,null),r.a.createElement(i.a,null,r.a.createElement(d.a,null,r.a.createElement(p.a,{md:{span:8,offset:2}},r.a.createElement(u.a,{exact:!0,path:"/",component:R}),r.a.createElement(u.a,{path:"/signup",component:Q}),r.a.createElement(u.a,{path:"/signin",component:le}),r.a.createElement(u.a,{path:"/pw-forget",component:te}),r.a.createElement(u.a,{path:P,component:pe}),r.a.createElement(u.a,{path:"/account",component:ge}),r.a.createElement(u.a,{path:"/admin",component:we})))))});l.a.render(r.a.createElement(w.Provider,{value:new I},r.a.createElement(je,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},72:function(e,t,a){e.exports=a(133)},77:function(e,t,a){},78:function(e,t,a){}},[[72,1,2]]]);
//# sourceMappingURL=main.9ce90092.chunk.js.map