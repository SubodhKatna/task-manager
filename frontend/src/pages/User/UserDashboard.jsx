import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth.jsx";
import { useContext } from "react";
import { UserContext } from "../../context/userContent.jsx";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { IoMdCard } from "react-icons/io";
import { addThousandSeparators } from "../../utils/helper.js";
import InfoCard from "../../components/Cards/InfoCard.jsx";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable.jsx";
import CustomPieChart from "../../components/Charts/CustomPieChart.jsx";
import CustomBarChart from "../../components/Charts/CustomBarChart.jsx";

const COLORS = ["#8d51ff", "#00bbdb", "#7bce00"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const onSeeMore = () => {
    navigate("users/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
        <InfoCard
          icon={<IoMdCard />}
          label="Total Tasks"
          value={addThousandSeparators(
            dashboardData?.charts?.taskDistribution?.All || 0
          )}
          color="bg-primary"
        />

        <InfoCard
          icon={<IoMdCard />}
          label="Pending Tasks"
          value={addThousandSeparators(
            dashboardData?.charts?.taskDistribution?.Pending || 0
          )}
          color="bg-violet-500"
        />

        <InfoCard
          icon={<IoMdCard />}
          label="In Progress Tasks"
          value={addThousandSeparators(
            dashboardData?.charts?.taskDistribution?.InProgress || 0
          )}
          color="bg-cyan-500"
        />

        <InfoCard
          icon={<IoMdCard />}
          label="Completed Tasks"
          value={addThousandSeparators(
            dashboardData?.charts?.taskDistribution?.Completed || 0
          )}
          color="bg-lime-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Destribution</h5>
            </div>
            <CustomPieChart data={pieChartData || []} colors={COLORS} />
          </div>
        </div>
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">Task Destribution</h5>
            </div>
            <CustomBarChart data={barChartData || []} colors={COLORS} />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
