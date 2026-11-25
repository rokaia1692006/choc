export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Staff';
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
}

export interface StaffInvitationActivationRequest {
  email: string;
  code: string;
  password: string;
}