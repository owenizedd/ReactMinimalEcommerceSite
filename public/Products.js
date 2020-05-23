// No External library used, just React and babel for compiling JSX
// This is minimalist React Setup, I don't think we need CRA (Create React App ) for this.
class Hello extends React.Component{
  state = {
    isLoading : true
  }
  render(){
    return(
      <React.Fragment>
        {
          this.state.isLoading && <h1> Testsss </h1>
        }
      </React.Fragment>
    )
  }
}

ReactDOM.render(
 <Hello/>,
 document.getElementById('root')
);