const app = require('./components/App.js');
const serviceWorker = require('./src/serviceWorker.js');
const render = require('dom-serializer');

app.get('/', (req,res) => {
    res.send(index({
        content: render( h(App))
    }));
});


// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
