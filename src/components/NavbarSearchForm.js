import React from 'react' 
import searchIcon from "../assets/search.svg";

class NavbarSearchFrom extends React.Component {
     
    constructor (props) { 
        super(props);
        this.state = {
            value: ""
        }
    }
    
    componentDidMount() { 
    } 

    handleChange = (e) => {
        this.setState({value: e.target.value});
    };
 
    handleSubmit = (e) => {  
        if(this.state.value.lastIndexOf(".eth") !== -1)
            this.props.navigate("/"+ this.state.value)
        else if( this.state.value.lastIndexOf(".eth") === -1) {
            this.props.navigate("/find?label="+ this.state.value)
        } 
        e.preventDefault();
        return false;
    };

    render () {
        return (
            <form style={{minWidth:"500px"}} role="search" onSubmit={this.handleSubmit}>
                <div className="input-group input-group-lg">
                    <input className="form-control border-primary" type="search" placeholder="Search for web3 name " value={this.state.value} onChange={this.handleChange} />
                    <button className="btn btn-outline-primary" type="submit">
                        <img src={searchIcon}  alt=""  />
                    </button>
                </div>
            </form>
        )
    }
}

export default NavbarSearchFrom;