var expression;  // main expression
// id enum mapping a button action to an id
var idValues = {'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
                'decimal': 10, 'negative': 11,
                'addition': 12, 'subtraction': 13, 'multiplication': 14, 'division': 15,
                'open_parenthesis': 16, 'close_parenthesis': 17,
                'pi': 18, 'e': 19,
                'squared': 20, 'exponent': 21, 'square_root': 22, 'nth_root': 23, 'natural_log': 24, 'log': 25,
                'sin': 26, 'cos': 27, 'tan': 28, 'arc_sin': 29, 'arc_cos': 30, 'arc_tan': 31,
                'scientific_notation': 32};
// string list where index of string corresponds to its id 
var idStrings = ['\u0030', '\u0031', '\u0032', '\u0033', '\u0034', '\u0035', '\u0036', '\u0037', '\u0038', '\u0039',  // digits (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
                 '\u002E', '\u002D',  // extra numerical (10 - decimal, 11 - negative)
                 '\u002B', '\u2212', '\u00B7', '\u002F',  // basic operators (12 - addition, 13 - subtraction, 14 - multiplication, 15 - division)
                 '\u0028', '\u0029',  // parenthesis (16 - open, 17 - close)
                 '\u03C0', '\u0065',  // constants (18 - pi, 19 - e)
                 'UNUSED', '^', '\u221A', '\u221A', 'ln', 'log',  // additional operators (20 - squared, 21 - exponent, 22 - square root, 23 - nth root, 24 - natural log, 25 - log based 10)
                 'sin', 'cos', 'tan', 'sin<sup>-1</sup>', 'cos<sup>-1</sup>', 'tan<sup>-1</sup>',  // trigonometric functions (26 - sin, 27 - cos, 28 - tan, 29 - arcsin, 30 - arccos, 31 - arctan)
                 'E']; // 32 - scientific notation

/**
 * Start program and initialize main expression
 */
function init() {
    expressionView = document.getElementById('expression-textview');
    expression = new Expression(expressionView);

    document.getElementById('zero_button').onclick = function() { expression.append(idValues.zero); }
    document.getElementById('one_button').onclick = function() { expression.append(idValues.one); }
    document.getElementById('two_button').onclick = function() { expression.append(idValues.two); }
    document.getElementById('three_button').onclick = function() { expression.append(idValues.three); }
    document.getElementById('four_button').onclick = function() { expression.append(idValues.four); }
    document.getElementById('five_button').onclick = function() { expression.append(idValues.five); }
    document.getElementById('six_button').onclick = function() { expression.append(idValues.six); }
    document.getElementById('seven_button').onclick = function() { expression.append(idValues.seven); }
    document.getElementById('eight_button').onclick = function() { expression.append(idValues.eight); }
    document.getElementById('nine_button').onclick = function() { expression.append(idValues.nine); }
    document.getElementById('decimal_button').onclick = function() { expression.append(idValues.decimal); }

    document.getElementById('addition_button').onclick = function() { expression.append(idValues.addition); }
    document.getElementById('subtraction_button').onclick = function() { expression.append(idValues.subtraction); }
    document.getElementById('multiplication_button').onclick = function() { expression.append(idValues.multiplication); }
    document.getElementById('division_button').onclick = function() { expression.append(idValues.division); }
    document.getElementById('open_parenthesis_button').onclick = function() { expression.append(idValues.open_parenthesis); }
    document.getElementById('close_parenthesis_button').onclick = function() { expression.append(idValues.close_parenthesis); }
    document.getElementById('pi_button').onclick = function() { expression.append(idValues.pi); }
    document.getElementById('e_button').onclick = function() { expression.append(idValues.e); }
    document.getElementById('squared_button').onclick = function() { expression.append(idValues.squared); }
    document.getElementById('exponent_button').onclick = function() { expression.append(idValues.exponent); }
    document.getElementById('square_root_button').onclick = function() { expression.append(idValues.square_root); }
    document.getElementById('nth_root_button').onclick = function() { expression.append(idValues.nth_root); }
    document.getElementById('natural_log_button').onclick = function() { expression.append(idValues.natural_log); }
    document.getElementById('log_button').onclick = function() { expression.append(idValues.log); }
    document.getElementById('sin_button').onclick = function() { expression.append(idValues.sin); }
    document.getElementById('cos_button').onclick = function() { expression.append(idValues.cos); }
    document.getElementById('tan_button').onclick = function() { expression.append(idValues.tan); }
    document.getElementById('arc_sin_button').onclick = function() { expression.append(idValues.arc_sin); }
    document.getElementById('arc_cos_button').onclick = function() { expression.append(idValues.arc_cos); }
    document.getElementById('arc_tan_button').onclick = function() { expression.append(idValues.arc_tan); }
    document.getElementById('scientific_notation_button').onclick = function() { expression.append(idValues.scientific_notation); }

    document.getElementById('delete_button').onclick = function() { expression.delete(); }
    document.getElementById('clear_button').onclick = function() { expression.clear(); }
    document.getElementById('equal_button').onclick = function() { expression.evaluate(); }
}

/** Class managing an expression */
class Expression {
    constructor(expressionView) {
        this.idList = [];
        this.inputManager = new InputHandler();
        this.displayManager = new DisplayManager(expressionView);
    }

    /**
     * Append id to expression and display
     * 
     * @param {int} id - id to append
     */
    append(id) {
        var addedIds = this.inputManager.vetAppend(id, this.idList);
        Array.prototype.push.apply(this.idList, addedIds);
        this.displayManager.show(this.idList);
    }

    /**
     * Delete id from expression, clear if equal just pressed an display
     */
    delete() {
        if (this.inputManager.getEqualJustPressed()) {
            this.clear();
            this.inputManager.setEqualJustPressed(false);
            return;
        }
        this.inputManager.handleDelete(this.idList.pop(), this.idList);
        this.displayManager.show(this.idList);
    }

    /**
     * Clear expression and display
     */
    clear() {
        this.inputManager = new InputHandler();
    
        this.idList.length = 0;
        this.displayManager.show(this.idList);
    }

    /**
     * Calculate expression and display result
     */
    evaluate() {
        if (!this.inputManager.vetEqual(this.idList)) return;

        try { var calculator = new Calculator(this.idList); }
        catch (err) { return; }
        try {
            var result = calculator.execute().toString();
        } catch (e) {
            this.idList.length = 0;
            this.displayManager.showError('error');
            return;
        }  

        this.inputManager.setEqualJustPressed(true);

        this.idList.length = 0;
        for (var i = 0; i < result.length; i++) this.idList[i] = idStrings.indexOf(result[i]);
        this.displayManager.show(this.idList);
    }
}

/** Class handling expression changes */
class InputHandler {
    constructor() {
        this.decimalPressed = false;
        this.equalJustPressed = false;
        this.numericIds = [idValues.zero, idValues.one, idValues.two, idValues.three, idValues.four, idValues.five, idValues.six, idValues.seven, idValues.eight, idValues.nine, idValues.decimal, idValues.negative];
        this.operatorIds = [idValues.subtraction, idValues.addition, idValues.multiplication, idValues.division];
        this.constantIds = [idValues.pi, idValues.e];
        this.trigIds = [idValues.sin, idValues.cos, idValues.tan, idValues.arc_sin, idValues.arc_cos, idValues.arc_tan];
    }

    getEqualJustPressed() { return this.equalJustPressed; }
    setEqualJustPressed(equalJustPressed) { this.equalJustPressed = equalJustPressed; }

    /**
     * Accepts or denies a given id and possibly adds additional
     * 
     * @param {int} id - attempted id
     * @param {int[]} idList - current list of ids
     * 
     * @return {int[]} - ids to be added to expression
     */
    vetAppend(id, idList) {
        var addedIds = [];
        switch (id) {
            case idValues.zero: case idValues.one: case idValues.two: case idValues.three: case idValues.four:
            case idValues.five: case idValues.six: case idValues.seven: case idValues.eight: case idValues.nine:
                if (this.equalJustPressed) idList.length = 0;  // clear if equal just pressed
                if (this.constantIds.includes(idList[idList.length -1])) break;  // not allowed after a constant

                addedIds.push(id);
                break;
            case idValues.decimal:
                if (this.equalJustPressed) idList.length = 0;  // clear if equal just pressed
                if (this.decimalPressed
                    || idList[idList.length - 1] == idValues.close_parenthesis
                    || this.constantIds.includes(idList[idList.length - 1])) break;  // not allowed after decimal, close parenthesis, or constant

                addedIds.push(id);
                this.decimalPressed = true;
                break;
            case idValues.subtraction:
                if (idList[idList.length - 1] == idValues.negative
                    || (idList[idList.length - 1] == idValues.decimal && !this.numericIds.includes(idList[idList.length - 2]))) break;  // not allowed after negative or lone decimal
                if (idList.length == 0
                    || idList[idList.length - 1] == idValues.open_parenthesis
                    || this.operatorIds.includes(idList[idList.length - 1])
                    || idList[idList.length - 1] == idValues.exponent) {  // change subtraction to negative if first id, after open parenthesis or operator
                        addedIds.push(idValues.negative);
                        break;
                    }

                addedIds.push(id);
                this.decimalPressed = false;
                break;
            case idValues.addition: case idValues.multiplication: case idValues.division:
            case idValues.squared: case idValues.exponent:
                if (idList.length == 0
                    || idList[idList.length - 1] == idValues.negative
                    || idList[idList.length - 1] == idValues.open_parenthesis
                    || this.operatorIds.includes(idList[idList.length - 1])
                    || (idList[idList.length - 1] == idValues.decimal && !this.numericIds.includes(idList[idList.length - 2]))) break;  // not allwed if first id or after negative, open parenthesis, operator, or lone decimal

                addedIds.push(id);
                if (id == idValues.squared) {
                    addedIds.pop();
                    addedIds.push(idValues.exponent);
                    addedIds.push(idValues.two);
                }
                this.decimalPressed = false;
                break;
            case idValues.square_root:
                if (this.equalJustPressed) idList.length = 0;  // clear if equal just pressed
                if (this.numericIds.slice(0, this.numericIds.length - 2).includes(idList[idList.length - 1])) break;  // not allowed after digit

                addedIds.push(id);
                break;
            case idValues.nth_root:
                // addedIds.push(id);
                break;
            case idValues.natural_log: case idValues.log:
                if (this.numericIds.slice(0, this.numericIds.length - 2).includes(idList[idList.length - 1])) break;

                addedIds.push(id);
                addedIds.push(idValues.open_parenthesis);
                break;
            case idValues.open_parenthesis:
                if (this.equalJustPressed) idList.length = 0;  // clear if equal just pressed
                if (this.numericIds.includes(idList[idList.length - 1])) break;  // not allowed after numeric

                addedIds.push(id);
                break;
            case idValues.close_parenthesis:
                if (this.countParenthesisDiff(idList) < 1
                    || idList[idList.length - 1] == idValues.open_parenthesis) break;  // not allowed if same or less open parenthesis or after open parenthesis 

                addedIds.push(id);
                break;
            case idValues.pi: case idValues.e:
                if (idList[idList.length - 1] == idValues.decimal
                    || this.constantIds.includes(idList[idList.length - 1])
                    || this.numericIds.includes(idList[idList.length - 1])) break;  // not allowed constant or numeric

                addedIds.push(id);
                break;
            case idValues.sin: case idValues.cos: case idValues.tan:
            case idValues.arc_sin: case idValues.arc_cos: case idValues.arc_tan:
                if (this.equalJustPressed) idList.length = 0;  // clear if equal just pressed
                if (this.numericIds.includes(idList[idList.length - 1])) break;  // not allowed after digit

                addedIds.push(id);
                addedIds.push(idValues.open_parenthesis);
                break;
            case idValues.scientific_notation:
                if (idList.length == 0
                    || this.operatorIds.includes(idList[idList.length - 1])
                    || idList[idList.length - 1] == idValues.negative
                    || this.trigIds.includes(idList[idList.length - 1])) break;

                addedIds.push(idValues.multiplication);
                addedIds.push(idValues.one);
                addedIds.push(idValues.zero);
                addedIds.push(idValues.exponent);
                break;
        }
        if (this.equalJustPressed) this.equalJustPressed = false;

        return addedIds;
    }

    /**
     * Find difference of parenthesis in expression
     * 
     * @param {int[]} idList - list of ids
     * 
     * @return {int} - difference of open and close parenthesis
     */
    countParenthesisDiff(idList) {
        var parenthesis_diff = 0;
        for (var i = 0; i < idList.length; i++) {
            if (idList[i] == idValues.open_parenthesis) parenthesis_diff++;
            else if (idList[i] == idValues.close_parenthesis) parenthesis_diff--;
        }

        return parenthesis_diff;
    }

    /**
     * Check input on equal press
     * 
     * @param {int[]} idList 
     * 
     * @return {boolean} - whether equal should be allowed
     */
    vetEqual(idList) {
        if (idList.length == 0
            || this.operatorIds.includes(idList[idList.length - 1])
            || idList[idList.length - 1] == idValues.exponent
            || idList[idList.length - 1] == idValues.square_root
            || idList[idList.length - 1] == idValues.nth_root
            || idList[idList.length - 1] == idValues.open_parenthesis) return false;  // do not allow operator, exponent, square root, nth root, or open parenthesis (signifying function)

        return true;
    }

    /**
     * Update inputManager values during delete
     * 
     * @param {int} id - id to be deleted
     * @param {int[]} idList - current list of ids
     */
    handleDelete(id, idList) {
        switch (id) {
            case idValues.decimal:
                this.decimalPressed = false;
                break;
            case idValues.subtraction: case idValues.addition: case idValues.multiplication: case idValues.division:
                var i = idList.length - 1;
                while (this.numericIds.includes(idList[i])) {
                    if (idList[i--] == idValues.decimal) {
                        this.decimalPressed = true;
                        break;
                    }
                }
                break;
        }
    }
}

class DisplayManager {
    constructor(expressionView) {
        this.expressionView = expressionView;
        this.exponentMode = false;
    }

    /**
     * Populate expressionView with id elements and commas
     * 
     * @param {int[]} idList - list of ids to display
     */
    show(idList) {
        var digits = [idValues.zero, idValues.one, idValues.two, idValues.three, idValues.four, idValues.five, idValues.six, idValues.seven, idValues.eight, idValues.nine];

        var text = '';
        var decimalScene = false;
        var consecutiveDigits = '';
        for (var i = 0; i < idList.length; i++) {
            text += this.format(idList[i]);
            if (digits.includes(idList[i])) {
                if (consecutiveDigits.length > 2 && !decimalScene) {
                    var prevCommaNumber = consecutiveDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    consecutiveDigits += idList[i];
                    var newCommaNumber = consecutiveDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    text = text.substr(0, text.length - (prevCommaNumber + 1).length) + newCommaNumber;
                } else consecutiveDigits += idList[i];
            } else if (idList[i] == idValues.decimal) decimalScene = true;
            else {
                decimalScene = false;
                consecutiveDigits = '';
            }
        }

        this.expressionView.innerHTML = text;
    }

    /**
     * Show error in expression view
     * 
     * @param {string} error - error string
     */
    showError(error) {
        this.expressionView.innerHTML = error;
    }

    /**
     * Format from basic string
     * 
     * @param {int} id - id corresponding to string
     * 
     * @return {string} - formatted string
     */
    format(id) {
        return idStrings[id];
    }
}

class Calculator {
    constructor(idList) {
        this.idList = idList;
        this.currToken = {id: -1, value: -1};
        this.currTokenIndex = 0;
        this.numericIds = [idValues.zero, idValues.one, idValues.two, idValues.three, idValues.four, idValues.five, idValues.six, idValues.seven, idValues.eight, idValues.nine, idValues.decimal];
    }

    /**
     * Start grammar and traverse tree for result
     * 
     * @return {float} - expression result
     */
    execute() {
        this.extractNextToken();
        var tree = this.adam();

        var result = tree.calculate();
        if (result == 'Infinity' || isNaN(result)) throw 'undefined';

        return result;
    }

    /**
     * Extract the next token from idList
     */
    extractNextToken() {
        if (this.numericIds.includes(this.idList[this.currTokenIndex])) {
            var numStr = idStrings[this.idList[this.currTokenIndex++].toString()];
            while (this.numericIds.includes(this.idList[this.currTokenIndex])) numStr += idStrings[this.idList[this.currTokenIndex++]];
            var num = parseFloat(numStr);
            if (isNaN(num)) throw 0;

            this.currToken.id = 0;
            this.currToken.value = parseFloat(num);
        } else this.currToken.id = this.idList[this.currTokenIndex++];
    }

    /*
        E -> TE'
        E' -> +TE' | -TE' | nothing
    */
    adam() {
        var value = this.blake();

        while (this.currToken.id == idValues.addition || this.currToken.id == idValues.subtraction) {
            if (this.currToken.id == idValues.addition) {
                this.extractNextToken();
                value = new Tree(idValues.addition, value, this.blake(), -1);
            } else if (this.currToken.id == idValues.subtraction) {
                this.extractNextToken();
                value = new Tree(idValues.subtraction, value, this.blake(), -1);
            }
        }

        return value;
    }

    /*
        T -> HT'
        T' -> *HT' | /HT' | nothing
    */
    blake() {
        var value = this.cole();
        
        while (this.currToken.id == idValues.multiplication || this.currToken.id == idValues.division) {
            if (this.currToken.id == idValues.multiplication) {
                this.extractNextToken();
                value = new Tree(idValues.multiplication, value, this.cole(), -1);
            }
            else if (this.currToken.id == idValues.division) {
                this.extractNextToken();
                value = new Tree(idValues.division, value, this.cole(), -1);
            }
        }

        return value;
    }

    /*
        C -> D^C'
        C' -> C
    */
    cole() {
        var value = this.dean();

        if (this.currToken.id == idValues.exponent) {
            this.extractNextToken();
            value = new Tree(idValues.exponent, value, this.cole(), -1);
        } else if (this.currToken.id == idValues.nth_root) {
            this.extractNextToken();
            value = new Tree(idValues.nth_root, value, this.cole(), -1);
        }
        return value;
    }

    /*
        F -> (E) | -F | NUM | pi | e
    */
    dean() {
        var value;
        switch (this.currToken.id) {
            case idValues.open_parenthesis:
                this.extractNextToken();
                value = this.adam()
                // if (this.currToken.id != idValues.close_parenthesis) throw 0;
                this.extractNextToken();
                break;
            case idValues.negative:
                this.extractNextToken();
                value = new Tree(idValues.negative, this.dean(), null, -1);
                break;
            case 0:
                value = new Tree(0, null, null, this.currToken.value);
                this.extractNextToken();
                break;
            case idValues.pi:
                value = new Tree(0, null, null, Math.PI);
                this.extractNextToken();
                break;
            case idValues.e:
                value = new Tree(0, null, null, Math.E);
                this.extractNextToken();
                break;
            case idValues.square_root:
                this.extractNextToken();
                value = new Tree(idValues.square_root, this.dean(), null, -1);
                break;
            case idValues.natural_log:
                this.extractNextToken();
                value = new Tree(idValues.natural_log, this.dean(), null, -1);
                break;
            case idValues.log:
                this.extractNextToken();
                value = new Tree(idValues.log, this.dean(), null, -1);
                break;
            case idValues.sin:
                this.extractNextToken();
                value = new Tree(idValues.sin, this.dean(), null, -1);
                break;
            case idValues.cos:
                this.extractNextToken();
                value = new Tree(idValues.cos, this.dean(), null, -1);
                break;
            case idValues.tan:
                this.extractNextToken();
                value = new Tree(idValues.tan, this.dean(), null, -1);
                break;
            case idValues.arc_sin:
                this.extractNextToken();
                value = new Tree(idValues.arc_sin, this.dean(), null, -1);
                break;
            case idValues.arc_cos:
                this.extractNextToken();
                value = new Tree(idValues.arc_cos, this.dean(), null, -1);
                break;
            case idValues.arc_tan:
                this.extractNextToken();
                value = new Tree(idValues.arc_tan, this.dean(), null, -1);
                break;                 
            default:
                throw 0;
        }
        
        return value;
    }
}

class Tree {
    constructor(id, left, right, value) {
        this.id = id;
        this.left = left;
        this.right = right;
        this.value = value;
    }

    /**
     * Evaluate tree
     * 
     * @return {float} - tree result
     */
    calculate() {
        switch (this.id) {
            case 0:
                return this.value;
            case idValues.negative:
                return -1 * this.left.calculate();
            case idValues.addition:
                return this.left.calculate() + this.right.calculate();
            case idValues.subtraction:
                return this.left.calculate() - this.right.calculate();
            case idValues.multiplication:
                return this.left.calculate() * this.right.calculate();
            case idValues.division:
                return this.left.calculate() / this.right.calculate();
            case idValues.exponent:
                return Math.pow(this.left.calculate(), this.right.calculate());
            case idValues.square_root:
                return Math.sqrt(this.left.calculate());
            case idValues.nth_root:
                return Math.pow(this.right.calculate(), 1/this.left.calculate());
            case idValues.natural_log:
                return Math.log(this.left.calculate());
            case idValues.log:
                return Math.log10(this.left.calculate());
            case idValues.sin:
                return Math.sin(this.left.calculate());
            case idValues.cos:
                return Math.cos(this.left.calculate());
            case idValues.tan:
                return Math.tan(this.left.calculate());
            case idValues.arc_sin:
                return Math.asin(this.left.calculate());
            case idValues.arc_cos:
                return Math.acos(this.left.calculate());
            case idValues.arc_tan:
                return Math.atan(this.left.calculate());
        }
    }
}