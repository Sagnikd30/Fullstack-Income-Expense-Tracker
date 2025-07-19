import React , {useEffect, useState}from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/dashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import ExpenseOverview from '../../components/ExpenseOverview';
import AddExpenseForm from '../../components/AddExpenseForm';
import Modal from '../../components/modals';
import toast from 'react-hot-toast';
import ExpenseList from '../../components/ExpenseList';
import DeleteAlert from '../../components/deleteAlert';

const Expense = () => {
  useUserAuth();

   const [ExpenseData, setExpenseData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(true);

    const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`);
      if(response.data){
        setExpenseData(response.data);
      }
    }catch (error) {
      console.error("Error fetching income details:", error);
    }finally
    {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const {category,amount, date, icon} = expense;

    if(!category.trim()){
      toast.error("Category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <=0){
      toast.error("Source is required");
      return;
    }

    if(!date){
      toast.error("Date is required");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    }catch (error){
      console.error(
        "Error in adding Expense",
        error.response?.data?.message || error.message
      );
    }
  };

  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null});
      toast.success("Expense details deleted successfully ");
      fetchExpenseDetails();
    }catch(error){
      console.error("error in deleting Expense",error.response?.data?.message || error.message);
    }
  
  };

  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{responseType:"blob",});

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.setAttribute("download","expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch (error){
      console.error("error in downloading expense details",error);
      toast.error("Failed to download expense details. Please try again");
    }
  };

  useEffect(()=>{
    fetchExpenseDetails();

    return()=> {};
  }, []);
  
  return (
<DashboardLayout activeMenu="Expense">
  <div className="my-5 mx-auto">
    <div className="grid grid-cols-1 gap-6">
      <div className="">
        <ExpenseOverview
          transactions={ExpenseData}
          onExpenseIncome={() => setOpenAddExpenseModal(true)}
        />
      </div>

      <ExpenseList
        transactions={ExpenseData}
        onDelete={(id)=> {
          setOpenDeleteAlert({show:true, data:id});
        }}
        onDownload={handleDownloadExpenseDetails}
      ></ExpenseList>
    </div>
    <Modal
      isOpen={openAddExpenseModal}
      onClose={()=> setOpenAddExpenseModal(false)}
      title="Add Expense"
    >
      <AddExpenseForm onSubmit={handleAddExpense}/>
    </Modal>

    <Modal
         isOpen={openDeleteAlert.show}
         onClose={()=>setOpenDeleteAlert({show:false,data:null})}
         title="Delete Expense"
        >
          <DeleteAlert
           content="Are you sure you want to delete this Expense details?"
           onDelete={()=> deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
  </div>
</DashboardLayout>
  )
}

export default Expense