export interface Banks {
    id: string;
    bank_name: string,
    bank_abreviation: string,
    account_number: string,
    status: "active" | "inactive"|"suspended"|"closed"
}
