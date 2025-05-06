
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface HistoryHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isBulkDeleteDialogOpen: boolean;
  setIsBulkDeleteDialogOpen: (isOpen: boolean) => void;
  onClearHistory: () => void;
}

const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  isBulkDeleteDialogOpen,
  setIsBulkDeleteDialogOpen,
  onClearHistory
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Histórico de Buscas</h1>
        <Link to="/dashboard">
          <Button variant="outline" className="flex gap-2 items-center">
            <ArrowRight size={16} className="rotate-180" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar no histórico..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="text-white">
              Limpar histórico
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Limpar histórico de buscas</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja apagar todo o histórico de buscas? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onClearHistory}>Limpar histórico</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default HistoryHeader;
