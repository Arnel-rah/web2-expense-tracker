export default function Home() {
    return (
        <div className="flex flex-col min-h-[100%] bg-gradient-to-br from-blue-50 to-indigo-100 lg:flex-row">
            <div className="flex h-screen w-full lg:w-1/2 flex-col justify-center p-8 md:p-12 space-y-8">
                <header className="flex items-center space-x-4 absolute left-7 top-2">
                    <img
                        src="/public/expense-logo.png"
                        alt="Expense Tracker Logo"
                        className="w-16 h-16"
                    />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Expense Tracker
                    </h1>
                </header>

                <section className="space-y-4 flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Efficient Money Tracking & Management
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md">
                        Take full control of your money and achieve financial stability with Expense Tracker
                    </p>
                </section>

                <div className="flex justify-center">
                    <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg ">
                        Get Started
                    </a>
                </div>
            </div>

            <div className="w-full xl:h-screen xl:w-1/2">
                <img
                    src="/src/assets/img/expenseImage.jpg"
                    alt="Expense tracking illustration"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}