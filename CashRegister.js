"use strict"

const goods = require('./data/goods.json')
const promotions = require('./data/promotions.json')

const goods_list = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
]


class CashRegister {
  constructor() {
    this.final_obj = {}
  }

  process(list) {
    this.list = list
    this.process_original_list().process_promotions().process_price()
    return this.generate_receipt(this.final_obj)
  }

  _get_goods_detail(code) {
    return goods.find(item => item.code === code)
  }

  _get_item_promotion(code) {
    let p = promotions.find(promo => promo.items.find(pitem => pitem === code))
    return p ? p.code : null
  }

  process_original_list() {
    let list = this.list
    let basic_list = []

    for (let item of list) {
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
    let purchase_list = this.list
    for (let item of purchase_list) {
      let promo = this._get_item_promotion(item.code)
      if (promo && !item.promo) item.promo = promo
    }
    this.list = purchase_list
    return this
  }

  process_price() {
    let purchase_list = this.list
    let summary = {
      total: 0.00,
      saving: 0.00
    }
    let buy_2_get_1 = []

    for (let item of purchase_list) {
      if (item.promo === 'BUY_2_GET_1_FREE') {
        let saving_count = Math.floor(item.count / 3)
        item.saving = saving_count * item.price
        item.summary = item.count * item.price - item.saving
        let gift_obj = {
          name: item.name,
          count: saving_count,
          unit: item.unit
        }
        buy_2_get_1.push(gift_obj)
      } else if (item.promo === '5_PERCENT_OFF') {
        item.saving = item.count * item.price * 0.05
        item.summary = item.count * item.price - item.saving
      } else {
        item.summary = item.count * item.price
      }

      summary.total += item.summary
      summary.saving += item.saving || 0
    }

    this.final_obj = {
      'detail': purchase_list,
      '2get1': buy_2_get_1,
      'summary': summary
    }
  }

  generate_receipt(final_obj) {
    let receipt = '***<没钱赚商店>购物清单***\n'
    for (let item of final_obj.detail) {
      receipt += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.summary.toFixed(2)}(元)`
      if (item.promo === '5_PERCENT_OFF') {
        receipt += `，节省${item.saving.toFixed(2)}(元)`
      }
      receipt += '\n'
    }
    receipt += '----------------------\n'

    if (final_obj['2get1'].length > 0) {
      receipt += '买二赠一商品：\n'
      for (let item of final_obj['2get1']) {
        receipt += `名称：${item.name}，数量：${item.count}${item.unit}\n`
      }
      receipt += '----------------------\n'
    }

    receipt += `总计：${final_obj.summary.total.toFixed(2)}(元)\n`
    if (final_obj.summary.saving > 0) {
      receipt += `节省：${final_obj.summary.saving.toFixed(2)}(元)\n`
    }
    receipt += '**********************'
    return receipt
  }
}

module.exports = CashRegister