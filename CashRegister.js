"use strict"

const goods = require('./data/goods.json')
const promotions = require('./data/promotions.json')

class CashRegister {
  constructor(list) {
    this.list = list
    this.final_list = {}
  }

  process() {
    this.process_original_list().process_promotions().process_price()
    return this.generate_receipt()
  }

  _get_goods_detail(code) {
    return goods.find(item => item.code === code)
  }

  _get_item_promotion(code) {
    let p = promotions.find(promo => promo.items.find(pitem => pitem === code))
    return p ? p.code : null
  }

  _get_promo_saving() {
    let buy_2_get_1 = []
    for (let item of this.list) {
      if (item.promo === 'BUY_2_GET_1_FREE') {
        let saving_count = Math.floor(item.count / 3)
        item.saving = saving_count * item.price
        buy_2_get_1.push({
          name: item.name,
          count: saving_count,
          unit: item.unit
        })
      } else if (item.promo === '5_PERCENT_OFF') {
        item.saving = item.count * item.price * 0.05
      }

      item.summary = item.count * item.price
      item.summary -= item.saving || 0
    }
    return buy_2_get_1
  }

  process_original_list() {
    let basic_list = []

    for (let item of this.list) {
      let code = (item.indexOf('-') > -1) ? item.split('-')[0] : item
      let times = (item.indexOf('-') > -1) ? parseInt(item.split('-')[1]) : 1
      let exist_index = basic_list.findIndex(x => x.code === code)

      if (exist_index === -1) {
        let detail = this._get_goods_detail(code)
        if (!detail) continue
        detail.count = times
        basic_list.push(detail)
      } else {
        basic_list[exist_index].count++
      }
    }
    this.list = basic_list
    return this
  }

  process_promotions() {
    for (let item of this.list) {
      let promo = this._get_item_promotion(item.code)
      if (promo && !item.promo) item.promo = promo
    }
    return this
  }

  process_price() {
    let summary = {
      total: 0.00,
      saving: 0.00
    }
    
    let promo_2get1_list = this._get_promo_saving()
    summary.total = this.list.reduce((sum, item) => sum += item.summary, 0.00)
    summary.saving = this.list.reduce((sum, item) => sum += item.saving || 0, 0.00)

    this.final_list = {
      'detail': this.list,
      '2get1': promo_2get1_list,
      'summary': summary
    }
  }

  generate_receipt() {
    let final_obj = this.final_list

    const temp_separator = '-'.repeat(22) + '\n'
    const final_separator = '*'.repeat(22)

    let receipt = '***<没钱赚商店>购物清单***\n'
    for (let item of final_obj.detail) {
      receipt += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.summary.toFixed(2)}(元)`
      if (item.promo === '5_PERCENT_OFF') {
        receipt += `，节省${item.saving.toFixed(2)}(元)`
      }
      receipt += '\n'
    }
    receipt += temp_separator

    if (final_obj['2get1'].length > 0) {
      receipt += '买二赠一商品：\n'
      for (let item of final_obj['2get1']) {
        receipt += `名称：${item.name}，数量：${item.count}${item.unit}\n`
      }
      receipt += temp_separator
    }

    receipt += `总计：${final_obj.summary.total.toFixed(2)}(元)\n`
    if (final_obj.summary.saving > 0) {
      receipt += `节省：${final_obj.summary.saving.toFixed(2)}(元)\n`
    }
    receipt += final_separator
    return receipt
  }

}

module.exports = CashRegister