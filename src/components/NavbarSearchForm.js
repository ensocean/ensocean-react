import React from 'react' 

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
            <form className="w-100" role="search" onSubmit={this.handleSubmit}>
                <div className="input-group input-group-lg">
                    <input className="form-control border-primary" type="search" placeholder="Search for web3 name " value={this.state.value} onChange={this.handleChange} />
                    <button className="btn btn-outline-primary" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                        </svg>
                    </button>
                </div>
            </form>
        )
    }
}

export default NavbarSearchFrom;