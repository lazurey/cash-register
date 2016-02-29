const CashRegister = require('./CashRegister')

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

const machine = new CashRegister()

const receipt = machine.process(goods_list)
console.log(receipt)