import { Copy, Building2 } from "lucide-react";
import { toast } from "sonner";
import { BANKS } from "@/data";

export const BankInfo = () => {
  const copy = (text) => {
    navigator.clipboard.writeText(text.replace(/-/g, ""));
    toast.success("Nomor rekening disalin");
  };

  return (
    <div className="bg-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5" />
        <h3 className="font-display font-bold text-lg">Informasi Pembayaran</h3>
      </div>
      <p className="text-sm text-blue-100 mb-5">
        Silakan transfer sesuai biaya kursus, lalu unggah bukti pembayaran pada form pendaftaran.
      </p>
      <div className="space-y-3">
        {BANKS.map((b) => (
          <div key={b.bank_name} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-xs text-blue-100 font-medium">{b.bank_name}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="font-display text-lg font-bold tracking-wide">{b.account_number}</p>
              <button
                data-testid={`copy-rekening-${b.bank_name.replace(/\s/g, "-").toLowerCase()}`}
                onClick={() => copy(b.account_number)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">a.n. {b.account_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
