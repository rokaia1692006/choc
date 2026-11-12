export interface CapacitySettings {
  acceptingOrders: boolean;        
  pausedMessage?: string;
  pausedMessageAr?: string;
  defaultMaxOrdersPerDay: number;    
  openWeekdays: number[];           
  leadTimeDays: number;              
}

export interface CapacityDay {
  date: string;                      
  open: boolean;
  max: number;
  used: number;                   
  overridden: boolean;             
}

export interface CapacityResponse { settings: CapacitySettings; days: CapacityDay[]; }
