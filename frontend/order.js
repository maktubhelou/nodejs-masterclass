"use strict";

const e = React.createElement;

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ordered: false, order: "hi there", menu: "" };
  }

  render() {
    const getData = () => {
      return fetch("http://localhost:3000/menu", {
        mode: "no-cors"
      }).then(response => response.json());
    };
    console.log(getData());
    const orderData = getData();
    if (this.state.liked) {
      return `You ordered this: ${JSON.stringify(orderData)}`;
    }

    return e(
      "button",
      { onClick: () => this.setState({ liked: true }) },
      "Like"
    );
  }
}

const domContainer = document.querySelector("#order");
ReactDOM.render(e(Order), domContainer);
