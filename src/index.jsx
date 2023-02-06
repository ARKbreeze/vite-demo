import Server from 'react-dom/server';

let Greet = () => <h1>hello juejin!</h1>;
console.log(Server.renderToString(<Greet></Greet>));
