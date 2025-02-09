// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

struct User {
    address addr;
    string codename;
}

struct UserWithBalance {
    address addr;
    string codename;
    uint256 balance;
}

contract Saturing is ERC20 {
    mapping(address => uint256) public balances;

    address public owner;
    address public constant teacher =
        0x502542668aF09fa7aea52174b9965A7799343Df7;
    bool public votingActive;
    User[] public users;
    mapping(string => address) public codenames;
    mapping(address => bool) public usersRegistered;
    mapping(address => mapping(string => bool)) public voted;

    constructor() ERC20("SATURING", "STU") {
        owner = msg.sender;
        votingActive = true;
    }

    function registerUser(
        string memory codename,
        address addr
    ) public onlyOwnerOrTeacher {
        require(
            codenames[codename] == address(0),
            "Codinome ja foi registrado."
        );
        require(!usersRegistered[addr], "Endereco ja registrado.");
        codenames[codename] = addr;

        usersRegistered[addr] = true;
        users.push(User(addr, codename));
    }

    function registerUsers(
        string[] memory codenamesArray,
        address[] memory addressesArray
    ) public onlyOwnerOrTeacher {
        require(
            codenamesArray.length == addressesArray.length,
            "Arrays devem ter o mesmo tamanho."
        );

        for (uint256 i = 0; i < codenamesArray.length; i++) {
            string memory codename = codenamesArray[i];
            address addr = addressesArray[i];

            require(
                codenames[codename] == address(0),
                "Codinome ja foi registrado."
            );
            require(!usersRegistered[addr], "Endereco ja registrado.");
        }

        for (uint256 i = 0; i < codenamesArray.length; i++) {
            string memory codename = codenamesArray[i];
            address addr = addressesArray[i];

            codenames[codename] = addr;
            usersRegistered[addr] = true;
            users.push(User(addr, codename));
        }
    }

    function getUsers() public view returns (User[] memory) {
        return users;
    }

    function getUsersToVote() public view returns (User[] memory) {
        if (!usersRegistered[msg.sender]) {
            return new User[](0);
        }
        uint256 count = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (
                !voted[msg.sender][users[i].codename] &&
                users[i].addr != msg.sender
            ) {
                count++;
            }
        }
        User[] memory usersToVote = new User[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (
                !voted[msg.sender][users[i].codename] &&
                users[i].addr != msg.sender
            ) {
                usersToVote[index] = users[i];
                index++;
            }
        }
        return usersToVote;
    }

    function issueToken(
        string memory codename,
        uint256 amount
    ) public onlyOwnerOrTeacher {
        address recipient = codenames[codename];
        require(recipient != address(0), "Codinome nao registrado.");
        _mint(recipient, amount);
    }

    function vote(
        string memory codename,
        uint256 amount
    ) public whenVotingActive onlyRegistered {
        address user = codenames[codename];

        require(user != address(0), "Codinome candidato nao registrado");
        require(user != msg.sender, "Nao pode votar em si mesmo");
        require(!voted[msg.sender][codename], "Ja votou para esse codinome");
        require(
            amount <= 2 * 10 ** 18,
            "Quantidade de saturings acima do maximo permitido"
        );

        voted[msg.sender][codename] = true;

        _mint(user, amount);
        _mint(msg.sender, 2 * 10 ** 17);
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == owner || msg.sender == teacher;
    }

    function getUsersWithBalance()
        public
        view
        returns (UserWithBalance[] memory)
    {
        UserWithBalance[] memory usersWithBalance = new UserWithBalance[](
            users.length
        );
        for (uint256 i = 0; i < users.length; i++) {
            usersWithBalance[i] = UserWithBalance(
                users[i].addr,
                users[i].codename,
                balanceOf(users[i].addr)
            );
        }
        return usersWithBalance;
    }

    function votingToggle() public onlyOwnerOrTeacher {
        votingActive = !votingActive;
    }

    function resetSystem() public onlyOwnerOrTeacher {
        for (uint256 i = 0; i < users.length; i++) {
            _burn(users[i].addr, balanceOf(users[i].addr));
        }

        for (uint256 i = 0; i < users.length; i++) {
            for (uint256 j = 0; j < users.length; j++) {
                delete voted[users[i].addr][users[j].codename];
            }
        }

        for (uint256 i = 0; i < users.length; i++) {
            delete codenames[users[i].codename];
            delete usersRegistered[users[i].addr];
        }

        delete users;

        votingActive = true;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Somente professor.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Somente dono.");
        _;
    }

    modifier onlyOwnerOrTeacher() {
        require(
            msg.sender == owner || msg.sender == teacher,
            "Somente professor ou dono."
        );
        _;
    }

    modifier whenVotingActive() {
        require(votingActive, "Votacao inativa.");
        _;
    }

    modifier onlyRegistered() {
        require(usersRegistered[msg.sender], "Usuario nao esta registrado.");
        _;
    }
}
