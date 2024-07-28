import supabase from "@/utils/supabase";

export async function fetchDonations() {
    try {
        const SetNewView = async () => {
            const { data, error } = await supabase.from('Donation').select('*');
            if(data) console.log(data)
            if(error) console.log(error)
        };
        SetNewView();
    } catch (err) {
        console.error(err);
        return null;
    }
}
