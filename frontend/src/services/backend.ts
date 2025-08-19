console.log('Backend module loaded');

// Types pour notre application
export interface User {
  id: string;
  email: string;
  password: string; // En production, ce serait hashé
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  date: string;
  categoryId: string;
  description?: string;
  type: 'one-time' | 'recurring';
  startDate?: string; // For recurring expenses
  endDate?: string; // For recurring expenses
  receiptUrl?: string;
  createdAt: Date;
}

export interface Income {
  id: string;
  userId: string;
  amount: number;
  date: string;
  source: string;
  description?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
}

// Données simulées en mémoire
let users: User[] = [];
let expenses: Expense[] = [];
let incomes: Income[] = [];
let categories: Category[] = [];
let currentUser: User | null = null;

// Fonctions d'authentification
export const login = async (email: string, password: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let user = users.find(u => u.email === email && u.password === password);
  
  // Pour le développement: créer automatiquement l'utilisateur demo s'il n'existe pas
  if (email === 'demo@example.com' && password === 'password123' && !user) {
    console.log('Creating demo user automatically...');
    const newUser: User = {
      id: generateId(),
      email: 'demo@example.com',
      password: 'password123',
      createdAt: new Date()
    };
    
    users.push(newUser);
    user = newUser;
    
    // Créer des catégories par défaut
    const defaultCategories = [
      'Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Utilities'
    ];
    
    defaultCategories.forEach(name => {
      categories.push({
        id: generateId(),
        userId: newUser.id,
        name,
        isDefault: true
      });
    });
    
    // Sauvegarder les données
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('categories', JSON.stringify(categories));
  }
  
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Login successful:', user.email);
    return true;
  }
  
  console.log('Login failed for email:', email);
  return false;
};
export const signup = async (email: string, password: string): Promise<boolean> => {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Vérifier si l'email existe déjà
  if (users.some(u => u.email === email)) {
    console.log('Signup failed - email already exists:', email);
    return false;
  }
  
  const newUser: User = {
    id: generateId(),
    email,
    password, // En production, vous devriez hasher le mot de passe
    createdAt: new Date()
  };
  
  users.push(newUser);
  currentUser = newUser;
  
  // Créer des catégories par défaut pour l'utilisateur
  const defaultCategories = [
    'Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Utilities'
  ];
  
  defaultCategories.forEach(name => {
    categories.push({
      id: generateId(),
      userId: newUser.id,
      name,
      isDefault: true
    });
  });
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  console.log('Signup successful:', newUser.email);
  return true;
};

export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem('currentUser');
};

// Dans backend.ts
export const getCurrentUser = (): User | null => {
  if (!currentUser) {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        console.log('Retrieved user from localStorage:', currentUser); // Debug
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
  return currentUser;
};

// Fonctions pour les dépenses
export const getExpenses = async (filters?: {
  start?: string;
  end?: string;
  category?: string;
  type?: 'recurring' | 'one-time';
}): Promise<Expense[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  let userExpenses = expenses.filter(e => e.userId === user.id);
  
  if (filters) {
    if (filters.start) {
      userExpenses = userExpenses.filter(e => e.date >= filters.start!);
    }
    if (filters.end) {
      userExpenses = userExpenses.filter(e => e.date <= filters.end!);
    }
    if (filters.category) {
      userExpenses = userExpenses.filter(e => e.categoryId === filters.category!);
    }
    if (filters.type) {
      userExpenses = userExpenses.filter(e => e.type === filters.type!);
    }
  }
  
  return userExpenses;
};

export const createExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const newExpense: Expense = {
    ...expenseData,
    id: generateId(),
    userId: user.id,
    createdAt: new Date()
  };
  
  expenses.push(newExpense);
  return newExpense;
};

// Fonctions pour les revenus
export const getIncomes = async (filters?: {
  start?: string;
  end?: string;
}): Promise<Income[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  let userIncomes = incomes.filter(i => i.userId === user.id);
  
  if (filters) {
    if (filters.start) {
      userIncomes = userIncomes.filter(i => i.date >= filters.start!);
    }
    if (filters.end) {
      userIncomes = userIncomes.filter(i => i.date <= filters.end!);
    }
  }
  
  return userIncomes;
};

export const createIncome = async (incomeData: Omit<Income, 'id' | 'userId' | 'createdAt'>): Promise<Income> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const newIncome: Income = {
    ...incomeData,
    id: generateId(),
    userId: user.id,
    createdAt: new Date()
  };
  
  incomes.push(newIncome);
  return newIncome;
};

// Fonctions pour les catégories
export const getCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  return categories.filter(c => c.userId === user.id);
};

export const createCategory = async (name: string): Promise<Category> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  const newCategory: Category = {
    id: generateId(),
    userId: user.id,
    name,
    isDefault: false
  };
  
  categories.push(newCategory);
  return newCategory;
};

// Fonctions pour les résumés et alertes
export const getMonthlySummary = async (month?: string): Promise<{
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  
  // Déterminer la période (mois en cours par défaut)
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  const startDate = `${targetMonth}-01`;
  const endDate = `${targetMonth}-31`;
  
  // Calculer les revenus du mois
  const monthIncomes = incomes.filter(i => 
    i.userId === user.id && 
    i.date >= startDate && 
    i.date <= endDate
  );
  const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
  
  // Calculer les dépenses du mois (y compris les dépenses récurrentes)
  const monthExpenses = expenses.filter(e => {
    if (e.userId !== user.id) return false;
    
    if (e.type === 'one-time') {
      return e.date >= startDate && e.date <= endDate;
    } else {
      // Pour les dépenses récurrentes, vérifier si elles sont actives ce mois-ci
      const expenseStart = e.startDate || e.date;
      const expenseEnd = e.endDate || '9999-12-31'; // Si pas de endDate, considérer comme permanent
      
      return expenseStart <= endDate && expenseEnd >= startDate;
    }
  });
  
  const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses
  };
};

export const getBudgetAlert = async (): Promise<{
  hasAlert: boolean;
  message: string;
  amountOver: number;
}> => {
  const summary = await getMonthlySummary();
  
  if (summary.totalExpenses > summary.totalIncome) {
    return {
      hasAlert: true,
      message: `You've exceeded your budget for this month by $${(summary.totalExpenses - summary.totalIncome).toFixed(2)}`,
      amountOver: summary.totalExpenses - summary.totalIncome
    };
  }
  
  return {
    hasAlert: false,
    message: '',
    amountOver: 0
  };
};

// Fonction utilitaire pour générer des IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Initialiser les données si nécessaire
// Dans backend.ts, modifiez la partie initialisation
export const initializeData = () => {
  console.log('Initializing data...');
  
  try {
    const storedUsers = localStorage.getItem('users');
    const storedExpenses = localStorage.getItem('expenses');
    const storedIncomes = localStorage.getItem('incomes');
    const storedCategories = localStorage.getItem('categories');

    if (storedUsers) {
      users = JSON.parse(storedUsers);
    } else {
      // Créer un utilisateur de démo par défaut si aucun utilisateur n'existe
      const demoUser: User = {
        id: generateId(),
        email: 'demo@example.com',
        password: 'password123',
        createdAt: new Date()
      };
      users.push(demoUser);
      
      // Créer des catégories par défaut pour l'utilisateur de démo
      const defaultCategories = [
        'Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Utilities'
      ];
      
      defaultCategories.forEach(name => {
        categories.push({
          id: generateId(),
          userId: demoUser.id,
          name,
          isDefault: true
        });
      });
    }

    if (storedExpenses) expenses = JSON.parse(storedExpenses);
    if (storedIncomes) incomes = JSON.parse(storedIncomes);
    if (storedCategories) categories = JSON.parse(storedCategories);

    console.log('Data initialized:', { 
      users: users.length, 
      expenses: expenses.length, 
      incomes: incomes.length, 
      categories: categories.length 
    });
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Initialiser au chargement
initializeData();