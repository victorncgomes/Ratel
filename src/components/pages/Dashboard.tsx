import { TrendingUp, Users, Clock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const dataVolume = [
    { name: 'Seg', emails: 40 },
    { name: 'Ter', emails: 75 },
    { name: 'Qua', emails: 58 },
    { name: 'Qui', emails: 90 },
    { name: 'Sex', emails: 65 },
    { name: 'Sab', emails: 30 },
    { name: 'Dom', emails: 25 },
];

const dataActivity = [
    { name: '00:00', value: 10 },
    { name: '04:00', value: 5 },
    { name: '08:00', value: 80 },
    { name: '12:00', value: 120 },
    { name: '16:00', value: 90 },
    { name: '20:00', value: 45 },
    { name: '23:59', value: 20 },
];

const dataCategories = [
    { name: 'Trabalho', value: 450, color: '#2563EB' },
    { name: 'Social', value: 300, color: '#10B981' },
    { name: 'Promoções', value: 200, color: '#F59E0B' },
    { name: 'Updates', value: 150, color: '#6366F1' },
];

export function DashboardPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Visão geral da sua produtividade e métricas de email.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Recebidos</CardTitle>
                        <Mail className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+12% em relação à semana passada</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tempo de Leitura</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45m</div>
                        <p className="text-xs text-muted-foreground">Média diária estimada</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+5% melhor que a média</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Spam Bloqueado</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">Nos últimos 30 dias</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Main Chart */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Volume Semanal</CardTitle>
                        <CardDescription>Quantidade de emails processados nos últimos 7 dias</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataVolume}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="emails" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales/Categories Chart */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Categorias</CardTitle>
                        <CardDescription>Distribuição dos emails recebidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataCategories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
                            {dataCategories.map((item) => (
                                <div key={item.name} className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Horária</CardTitle>
                        <CardDescription>Picos de recebimento de emails</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataActivity}>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Tooltip />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Saúde da Caixa de Entrada</CardTitle>
                        <CardDescription>Status atual da sua organização</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Inbox Zero</p>
                                    <p className="text-sm text-muted-foreground">Você está mantendo o ritmo!</p>
                                </div>
                            </div>
                            <span className="text-green-600 font-bold">98%</span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium">Respostas Rápidas</p>
                                    <p className="text-sm text-muted-foreground">Tempo médio &#60; 2h</p>
                                </div>
                            </div>
                            <span className="text-blue-600 font-bold">Bom</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
