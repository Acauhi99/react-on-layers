import { Card } from '@/components/ui/card'
import { useBalance, useTransactions } from '@/hooks/use-financial'

export function DashboardPage() {
  const { data: balance } = useBalance()
  const { data: transactions } = useTransactions()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">
            R$ {balance?.income.toLocaleString() || '0'}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">
            R$ {balance?.expenses.toLocaleString() || '0'}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
          <p className={`text-2xl font-bold ${
            (balance?.total || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            R$ {balance?.total.toLocaleString() || '0'}
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
        <div className="space-y-2">
          {transactions?.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}