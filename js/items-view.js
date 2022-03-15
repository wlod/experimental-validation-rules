"use strict";

const ITEMS_VIEW_ID = "items-view";
const RULE_TYPE_REQUIRED = "REQUIRED";
const RULE_TYPE_REQUIRES = "REQUIRES";
const RULE_TYPE_EXCLUDES = "EXCLUDES";

class ItemsView {

    constructor(apiResponse) {
        this.apiResponse = apiResponse;
        this.validationRules = JSON.parse(apiResponse);
        this.itemsValidationRules = new ItemsValidationRules(this.validationRules);

        this.checkboxArray = new Array(this.validationRules.items.length);

        this.validationRules.items.forEach(item => {
            let checkbox = new CheckboxView(item, this.validationRules.items, this.itemsValidationRules);
            this.checkboxArray.push(checkbox);
        });
    }

    printItems() {
        const itemsViewContainer = _byId(ITEMS_VIEW_ID);
        itemsViewContainer.innerHTML = "";
        this.checkboxArray.forEach(checkbox => {
            checkbox.prepare();
        });
        this.itemsValidationRules.recalculateMaxSelectedItems(this.checkboxArray);
        // TODO after recalculate
        this.checkboxArray.forEach(checkbox => {
            checkbox.prepare();
        });
        this.checkboxArray.forEach(checkbox => {
            itemsViewContainer.innerHTML += checkbox.getItemAsHTML();
        });
    }

    selectItem(itemId) {
        this.checkboxArray.forEach(checkbox => {
            if(checkbox.item.id === itemId) {
                checkbox.selectItem();
                return;
            }
        });
    }

    removeDisableFlag(items) {
        this.checkboxArray.forEach(checkbox => {
            if(items.indexOf(checkbox.item.id) !== -1 && !checkbox.hasRule(checkbox.item, RULE_TYPE_REQUIRED)) {
                checkbox.removeDisableFlag();
            }
        });
    }
}

class CheckboxView {

    constructor(item, items, itemsValidationRules) {
        this.item = item;
        this.items = items;
        this.itemsValidationRules = itemsValidationRules;
    }

    _initData() {
        this.item.isChecked = typeof this.item.isChecked === "undefined" ? "" : this.item.isChecked;
        this.item.isDisabled = "";
    }

    prepare() {
            this._initData();

            this._disableByRequiredItem();
            this._disableByMaxSelectedItems();
            this._disableByRequiresItems();
            this._disableByExcludesItems();
            this._excludeItems();

            this._enable();
    }

    selectItem() {
        this.item.isChecked = this.item.isChecked ===  "checked" ? "" : "checked";
    }

    removeDisableFlag() {
        this.item.isDisabled = "";
    }

    // TODO remove item from _isChecked
    hasRule(item, rule) {
        let hasRule = false;
        item.validationsRules.forEach(itemRule => {
            if (itemRule.type === rule) {
                hasRule = true;
                return hasRule;
            }
        });
        return hasRule;
    }

    // TODO use hasRule after remove item
    _disableByRequiredItem() {
        this.item.validationsRules.forEach(rule => {
            if (RULE_TYPE_REQUIRED === rule.type) {
                 this.item.isDisabled = "disabled";
                 this.item.isChecked = "checked";
            }
        });
    }

    _disableByMaxSelectedItems() {
        if (this.itemsValidationRules.maxSelectedItems < 1) {
            this.item.isDisabled = "disabled";
        }
    }

    _disableByRequiresItems() {
        this.item.validationsRules.forEach(rule => {
            if (RULE_TYPE_REQUIRES === rule.type) {
                this.items.forEach(item => {
                    if(rule.items.indexOf(item.id) !== -1 && (this._isChecked(item) !== "checked")) {
                        this.item.isDisabled = "disabled";
                        this.item.isChecked = "";
                        return;
                    }
                });
            }
        });
    }

    _disableByExcludesItems() {
        this.items.forEach(item => {
            item.validationsRules.forEach(rule => {
                if (RULE_TYPE_EXCLUDES === rule.type) {
                    if(rule.items.indexOf(this.item.id) !== -1 && (this._isChecked(item) === "checked")) {
                        this.item.isDisabled = "disabled";
                        this.item.isChecked = "";
                        return;
                    }
                }
            });
       });
    }

    // TODO item is not necessary
    _isChecked(item) {
        return (this.hasRule(item, RULE_TYPE_REQUIRED) || item.isChecked) ? "checked" : "";
    }

    _excludeItems() {
        if (this._isChecked(this.item) !== "checked") {
            return;
        }
        this.item.validationsRules.forEach(rule => {
            if (RULE_TYPE_EXCLUDES !== rule.type) {
                return;
            }
            this.items.forEach(item => {
                if (rule.items.indexOf(item.id) !== -1) {
                    item.isChecked = "";
                }
            });
        });
    }

    _enable() {
        if (this.itemsValidationRules.isLastSelectedItem(this.item) && !this.hasRule(this.item, RULE_TYPE_REQUIRED)) {
            this.item.isDisabled = "";
        }
        if (this._isChecked(this.item)) {
            this.item.validationsRules.forEach(rule => {
                if (RULE_TYPE_REQUIRES === rule.type) {
                    // TODO spaghetti - access to itemsView
                    itemsView.removeDisableFlag(rule.items);
                }
            });
        }
    }

    getItemAsHTML() {
        return `<div>
                    <input type="checkbox" id="${this.item.id}" name="${this.item.name}" ${this.item.isDisabled} ${this.item.isChecked} onClick="selectItem(${this.item.id})">
                    <label for="${this.item.id}">${this.item.name}</label>
                </div>`
    }

}

class ItemsValidationRules {

    constructor(itemsValidationRules) {
        this.initialMaxSelectedItems = itemsValidationRules.maxSelectedItems;
        this.maxSelectedItems = itemsValidationRules.maxSelectedItems;
        this.selectedItems = new Array(itemsValidationRules.maxSelectedItems);
        this.lastSelectedItem = null;
    }

    recalculateMaxSelectedItems(checkboxArray) {
        this.selectedItems = this.selectedItems.splice(0,this.initialMaxSelectedItems);
        this.maxSelectedItems = this.initialMaxSelectedItems;
        checkboxArray.forEach(checkbox => {
            if(checkbox.item.isChecked) {
                this._decreaseMaxSelectedItemsByItem(checkbox.item);
            }
        });
    }

    isLastSelectedItem(item) {
        return this.lastSelectedItem && this.lastSelectedItem.id === item.id ? true : false;
    }

    _decreaseMaxSelectedItemsByItem(item) {
        if(this.selectedItems.indexOf(item.id) !== -1) {
            return;
        }
        this.lastSelectedItem = item;
        this.selectedItems.push(item.id);
        this.maxSelectedItems--;
    }
}