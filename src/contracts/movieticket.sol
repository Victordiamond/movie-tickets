// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Movietickets {
    uint private moviesLength = 0;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address public contractOwner;

    struct Movie {
        address payable admin;
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

    mapping(uint => Movie) private movies;
    mapping(uint => bool) private exists;

    modifier onlyAdmin(uint _index) {
        require(msg.sender == movies[_index].admin, "Only Admin");
        _;
    }

    /// @dev makes sure only movies that exist are queried
    modifier exist(uint _index){
        require(exists[_index], "Query of non existent movie");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    /// @dev carring out the function will add a new movie to the mapping
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
        movies[moviesLength] = Movie(
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

    /// @dev returns a movie
    function getMovie(uint _index) public view exist(_index) returns (Movie memory) {
        return movies[_index];
    }

    /// @dev to update the price of a movie's tickets
    function addTickets(uint _index, uint _tickets) external exist(_index) onlyAdmin(_index) {
        require(_tickets > 0, "number of tickets must be greater than zero");
        movies[_index].ticketsAvailable =
            movies[_index].ticketsAvailable +
            _tickets;
    }

    /// @dev changes the sale status of a movie
    function changeForsale(uint _index) external exist(_index) onlyAdmin(_index) {
        movies[_index].forSale = !movies[_index].forSale;
    }

    /// @dev remove a Ticket
    function removeMovie(uint _index) external exist(_index) {
        require(
            movies[_index].admin == msg.sender || contractOwner == msg.sender,
            "Unauthorized caller"
        );
        movies[_index] = movies[moviesLength - 1];
        delete movies[moviesLength - 1];
        moviesLength--;
    }


    /// @dev buys a ticket from a movie
    function buyMovieTicket(uint _index) public payable exist(_index) {
        require(
            movies[_index].admin != msg.sender,
            "Admin can't buy tickets of his own movie"
        );
        require(movies[_index].ticketsAvailable > 0, "sold out");
        require(movies[_index].forSale == true, "ticket is not for sale");
        movies[_index].sold++;
        movies[_index].ticketsAvailable--;
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                movies[_index].admin,
                movies[_index].price
            ),
            "Transfer failed."
        );
    }

    function getTicketsLength() public view returns (uint) {
        return (moviesLength);
    }
}
