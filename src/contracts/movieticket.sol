// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Movietickets {

    uint internal moviesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;


    struct Movieticket {
        address payable Admin;
        string name;
        string image;
        string filmIndustry;
        string genre;
        string description;
        uint price;
        uint sold;
        uint ticketsAvailable;
        bool forSale;
    }

    mapping (uint => Movieticket) internal movies;

    modifier onlyAdmin(uint _index) {
        require(msg.sender == movies[_index].Admin, "Only Admin");
        _;
    }

    modifier isTicketAvailable(uint _index, uint _tickets){
        require(movies[_index].ticketsAvailable > _tickets, "Tickets not sufficient" );
        _;
    }


    //carring out the function will add a new movie to the mapping
    function addMovie(
        string memory _name,
        string memory _image,
        string memory _filmIndustry,
        string memory _genre,
        string memory _description,  
        uint _price,
        uint _ticketsAvailable
    ) public {
        uint _sold = 0;
        movies[moviesLength] = Movieticket(
            payable(msg.sender),
            _name,
            _image,
            _filmIndustry,
            _genre,
            _description,
            _price,
            _sold,
            _ticketsAvailable,
            false
        );
        moviesLength++;
    }

    //Get details of a movie
    function getMovieticket(uint _index) public view returns (
        address payable,
        string memory, 
        string memory,  
        string memory,
        string memory,
        string memory,
        uint,
        uint,  
        uint,
        bool
    ) {
        Movieticket memory m = movies[_index];
        return (

            m.Admin,
            m.name, 
            m.image,
            m.filmIndustry,
            m.genre,
            m.description, 
            m.price,
            m.sold,
            m.ticketsAvailable,
            m.forSale
           
        );
    }

    
    // to update price of Ticket
    function addTickets(uint _index, uint _tickets) external onlyAdmin(_index) {
         require(_tickets > 0, "number of tickets must be greater than zero");
         movies[_index].ticketsAvailable = movies[_index].ticketsAvailable + _tickets;
    }

     function changeForsale(uint _index) external onlyAdmin(_index) {
         movies[_index].forSale = !movies[_index].forSale;
    }

    // remove a Ticket sale
    function removeSale(uint _index) external onlyAdmin(_index){      
        movies[_index] = movies[moviesLength - 1];
        delete movies[moviesLength - 1];
        moviesLength--; 
	 }

    // Function using which the user can remove tickets from circulation
     function blockTickets(uint _index, uint _tickets) external onlyAdmin(_index) isTicketAvailable(_index, _tickets){
        movies[_index].ticketsAvailable -= _tickets;
     }

    function buyMovieTicket(uint _index, uint _tickets) external payable  isTicketAvailable(_index, _tickets){
        require(movies[_index].forSale == true, "ticket is not for sale");
        require (msg.sender != movies[_index].Admin, "Admin cannot buy tickets");
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            movies[_index].Admin,
            movies[_index].price * _tickets
          ),
          "Transfer failed."
        );
        movies[_index].sold++;
        movies[_index].ticketsAvailable--;
    }
    
    function getTicketsLength() public view returns (uint) {
        return (moviesLength);
    }
}
