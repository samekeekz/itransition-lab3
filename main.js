"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var KeyGenerator = /** @class */ (function () {
    function KeyGenerator() {
    }
    KeyGenerator.generateKey = function () {
        return crypto.randomBytes(32).toString("hex");
    };
    return KeyGenerator;
}());
var HMACGenerator = /** @class */ (function () {
    function HMACGenerator() {
    }
    HMACGenerator.generateHMAC = function (message, key) {
        var hmac = crypto.createHmac("sha256", key);
        hmac.update(message);
        return hmac.digest("hex");
    };
    return HMACGenerator;
}());
var GameRules = /** @class */ (function () {
    function GameRules() {
    }
    GameRules.determineWinner = function (userMove, computerMove, moves) {
        var moveIndex = moves.indexOf(userMove);
        var half = moves.length / 2;
        var winningMoves = moves.slice(moveIndex + 1, moveIndex + 1 + half);
        var losingMoves = moves.slice(moveIndex - half, moveIndex);
        if (winningMoves.includes(computerMove)) {
            return "You win!";
        }
        else if (losingMoves.includes(computerMove)) {
            return "You lose!";
        }
        else {
            return "It's a draw!";
        }
    };
    return GameRules;
}());
var TableGenerator = /** @class */ (function () {
    function TableGenerator() {
    }
    TableGenerator.generateTable = function (moves) {
        var table = [__spreadArray(["Move"], moves, true)];
        for (var i = 0; i < moves.length; i++) {
            var row = [moves[i]];
            for (var j = 0; j < moves.length; j++) {
                if (i === j) {
                    row.push("Draw");
                }
                else if ((j - i + moves.length) % moves.length <= moves.length / 2) {
                    row.push("Win");
                }
                else {
                    row.push("Lose");
                }
            }
            table.push(row);
        }
        return table;
    };
    TableGenerator.printTable = function (table) {
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var row = table_1[_i];
            console.log(row.join("\t"));
        }
    };
    return TableGenerator;
}());
function printHelp(moves) {
    var table = TableGenerator.generateTable(moves);
    TableGenerator.printTable(table);
}
function main(moves) {
    if (moves.length < 3 ||
        moves.length % 2 === 0 ||
        new Set(moves).size !== moves.length) {
        console.error("Invalid arguments. Please provide an odd number of non-repeating moves.");
        console.error("Example: node game.js rock paper scissors");
        return;
    }
    var key = KeyGenerator.generateKey();
    var computerMove = moves[Math.floor(Math.random() * moves.length)];
    console.log("HMAC: ".concat(HMACGenerator.generateHMAC(computerMove, key)));
    console.log("Available moves:");
    moves.forEach(function (move, index) { return console.log("".concat(index + 1, " - ").concat(move)); });
    console.log("0 - exit");
    console.log("? - help");
    var readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    readline.question("Enter your move: ", function (index) {
        readline.close();
        if (index === "0") {
            console.log("Exiting the game.");
            return;
        }
        else if (index === "?") {
            printHelp(moves);
            return;
        }
        var userMove = moves[parseInt(index, 10) - 1];
        console.log("Your move: ".concat(userMove));
        console.log("Computer move: ".concat(computerMove));
        console.log("".concat(GameRules.determineWinner(userMove, computerMove, moves)));
        console.log("HMAC key: ".concat(key));
    });
}
var moves = process.argv.slice(2);
main(moves);
