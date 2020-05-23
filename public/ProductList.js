// No External library used, just React and babel for compiling JSX
// This is minimalist React Setup, I don't think we need CRA (Create React App ) for this.

//Actually we can import API from external project, but for this test, I'll just set it as property of class.
class ProductList extends React.Component{
  API = 'http://localhost:3000';
  state = {
    isLoading : true,
    products: [],
    currentPage: 1,
    isFetchingUpdate: false,
    previousAd: '',
    showAd: false,
  }
  async componentDidMount(){
    //set event listener to body
    window.addEventListener('scroll', this.bodyScroll);

    this.setState({
      isLoading: true
    })
    //logic: here since i'm going to put each scroll 10 items, means 1 page per scrolled view.
    //rather than check if the page if 50th page as latest items, i'm going to check if the API return empty array (no data)
    //to see if the data is over. 
    await fetch(`${this.API}/products?_page=${this.state.currentPage}`)
    .then(res => res.json())
    .then(data => {
      //by default data is array, checked the API.
      console.log(data)
      this.setState({
        products: data,
        currentPage: this.state.currentPage + 1,
        isLoading: false
      })
    })
    .catch(err => alert('error while fetching products ' + err.toString()));


    console.log(this.state);

  }

  bodyScroll = async() => {

    //logic: use isFetchingUpdate to mark if current state is fetching an update, because if we don't, probably unexpected
    //behavior will happen, just prevent multiple fetch in same time. possible of duplicate items.
    if (Math.round(document.body.getBoundingClientRect().bottom) <= innerHeight + 20 && !this.state.isFetchingUpdate){
      this.setState({isFetchingUpdate: true, isLoading: true});
      console.warn('test');
      //do fetch next page
      await fetch(`${this.API}/products?_page=${this.state.currentPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0){
          this.setState({endOfProduct: true, isLoading: false, isFetchingUpdate: false})
        }
        else{
          let newProducts = [...this.state.products, ...data];
          this.setState({
            products: newProducts,
            currentPage: this.state.currentPage + 1,
            isLoading: false,
            isFetchingUpdate: false,
          })
        }
      })
      .catch(err => alert('error while fetching products ' + err.toString()));
      
      //logic: because currentPage is actually next page, we subtract 1 every even page, that means it's every 20 products.
      if ( (this.state.currentPage - 1) % 2 === 0 && this.state.currentPage > 2){
        let nowRandom = Math.floor(Math.random() * 1000 + 1);
        while( nowRandom === this.state.previousAd) {
          nowRandom = Math.floor(Math.random() * 1000 + 1);
        }
        
        this.setState({showAd: true, previousAd: nowRandom});
        
      }
    }
  }
  hideAd = () => {
    document.body.style.overflow='';
    this.setState({showAd: false});
  }
  filterProduct = (evt) => {
    let products = [...this.state.products];
    const {value} = evt.target;
    if (value === 'id'){
      products.sort(compareID);
    }
    else if (value==='price'){
      products.sort(comparePrice);
    }
    else if (value==='date'){
      products.sort(compareDate);
    }

    this.setState({products: products});
  }
  render(){
    let products = this.state.products.map(product => <Product key={product.id} size={product.size} price={product.price} face={product.face} date={product.date} />)
    return(
      <React.Fragment>
        <span style={{marginLeft: '25px'}}>Sort by: </span>
        <select name="filterProduct" id="" onChange={this.filterProduct}>
          <option value="">-- FILTER PRODUCT --</option>
          <option value="id">ID</option>
          <option value="price">Price</option>
          <option value="date">Date</option>
        </select>
        <div className="container">
          {products}
        </div>
        {this.state.isLoading && <Loading/>}
        {this.state.showAd && <AdModal id={this.state.previousAd} onClick={this.hideAd}/>}
      </React.Fragment>
    )
  }
}

/*

          STATELESS COMPONENTS

*/


//All of these elements can be made in another file easily but for simplicity, I'm just put it here now.
const Loading = () => {
  return(
    <h1 className="loading">Loading...</h1>
  )
}
const Product = ({size, price, face, date}) => {
  let dateStr = '';
  let daysPassed = getDaysPassed(date);
  if (daysPassed === 0){
    dateStr = 'Today';
  }
  else if (daysPassed === 1){
    dateStr = 'Yesterday';
  }
  else if (daysPassed > 1 && daysPassed <= 7){
    dateStr = `${daysPassed} days ago`;
  } 
  else if (daysPassed > 7) {
    dateStr = new Date(date).toDateString();
  }
  return (
    <div className="product">
      <p className="product-face" style={{fontSize: size + 'px'}}>{face}</p>
      <p className="product-price">{price}</p>
      <p className="product-date">{dateStr}</p>
    </div>
  )
}

const AdModal = ({id, onClick}) => {
  document.body.style.overflow = 'hidden';
  return(
    <div className="admodal">
      <div className="adcontainer">
        <p>But first, a word from our sponsors:</p>
        <img class="ad" src={`/ads/?r=${id}`}/>
        <button onClick={onClick} className="btn">Close Ad</button>
      </div>
    </div>
  )
}

/*

          UTILITY FUNCTIONS

*/
//Custom date function without library
const getDaysPassed = (date) => {
  //logic: it's very simple, just convert resulting difference to second, then minute, then hours, then days, there we have it.
  return (Math.floor( (new Date() - new Date(date)) / 1000 / 60 / 60 / 24));
}
//custom comparator for sort array products
const compareID = (a,b) => {
  if (a.id.localeCompare(b.id) === -1){
    return -1;
  }
  else if (a.id.localeCompare(b.id) === 1){
    return 1;
  }
  else return 0;
}
const comparePrice = (a,b) => {
  if (a.price < b.price) return -1;
  else if (a.price > b.price) return 1;
  else return 0;
}
const compareDate = (a,b) => {
  let dateA = new Date(a.date);
  let dateB = new Date(b.date);
  if (dateA < dateB) return -1;
  else if (dateA > dateB) return 1;
  else return 0;
}

// Render React to HTML
ReactDOM.render(
 <ProductList/>,
 document.getElementById('root')
);


//javascript