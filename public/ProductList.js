// No External library used, just React and babel for compiling JSX
// This is minimalist React Setup, I don't think we need CRA (Create React App ) for this.

//Actually we can import API from external project, but for this test, I'll just set it as property of class.
class ProductList extends React.Component{
  API = 'http://localhost:3000';
  state = {
    isLoading : true,
    products: [],
    currentPage: 1,
  }
  componentDidMount(){
    //logic: here since i'm going to put each scroll 10 items, means 1 page per scrolled view.
    //rather than check if the page if 50th page as latest items, i'm going to check if the API return empty array (no data)
    //to see if the data is over. 
    fetch(`${this.API}/products?_page=${this.state.currentPage}`)
    .then(res => res.json())
    .then(data => {
      //by default data is array, checked the API.
      console.log(data)
      this.setState({
        products: data
      })
    })


    //set event listener to body

    document.body.addEventListener('scroll', this.bodyScroll);
  }

  bodyScroll(){
    if (document.body.getBoundingClientRect().bottom<=innerHeight){
      console.log('test');
      //do fetch next page
    }
  }
  
  render(){
    return(
      <React.Fragment>
        {
          this.state.isLoading && <Loading/>
        }
      </React.Fragment>
    )
  }
}
//All of these elements can be made in another file easily but for simplicity, I'm just put it here now.
const Loading = () => {

}
const Product = () => {
  return (
    <h1>Product</h1>
  )
}


// Render React to HTML
ReactDOM.render(
 <ProductList/>,
 document.getElementById('root')
);


//javascript