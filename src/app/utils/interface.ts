export interface IModalProps {
  title: string;
  children: React.ReactNode;
  confirmModal: boolean;
  okAction?: () => void;
}
