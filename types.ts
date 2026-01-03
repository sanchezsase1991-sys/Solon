
export interface UserProfile {
  country: 'México' | 'Estados Unidos';
  location: string;
  experience: string;
  skills: string;
  age: number;
  sex: string;
  language: 'Español' | 'Inglés';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface JobOpportunity {
  date: string;
  companyName: string;
  contactInfo: string;
  applicationMethod: 'Presencial' | 'Oficial';
  address: string;
  urgency: string;
  requirements: string[];
  dailyInsight?: string;
  jobType?: string;
  officialLink?: string;
  coords?: {
    lat: number;
    lng: number;
  };
}

export interface InvestmentTip {
  title: string;
  advice: string;
}

export interface SectorStrategy {
  sector: string;
  icon: string;
  tips: InvestmentTip[];
}

export interface InvestmentStrategy {
  initialCapital: number;
  methodology: string;
  sectors: SectorStrategy[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  data?: {
    jobs?: JobOpportunity[];
    investment?: InvestmentStrategy;
  };
}
