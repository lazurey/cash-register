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

const machine = new CashRegister(goods_list)

const receipt = machine.process()
console.log(receipt)