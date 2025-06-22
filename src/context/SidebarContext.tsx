import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  menuData: any;
  loading: boolean;
  toggleSidebar: () => void;
  getJsonFile: (menu: string) => string;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("1Depth Menu");
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const getJsonFile = (menu: string) => {
    const dbMap: { [key: string]: string } = {
      "1Depth Menu1": "/db.json",
      "1Depth Menu2": "/db2.json",
      "1Depth Menu3": "/db3.json",
      sample: "/db4.json",
    };
    return dbMap[menu] || "/db.json";
  };

  // useEffect(() => {
  //   // if (!isOpen) return;

  //   setLoading(true);

  //   console.log("Fetching JSON from:", getJsonFile(selectedMenu));

  //   fetch(`${getJsonFile(selectedMenu)}?t=${new Date().getTime()}`, {
  //     cache: "no-store",
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       return res.text();
  //     })
  //     .then((text) => {
  //       if (!text) {
  //         throw new Error("Empty JSON response");
  //       }
  //       return JSON.parse(text);
  //     })
  //     .then((data) => {
  //       setMenuData(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error when fetching data:", err);
  //       setLoading(false);
  //     });
  // }, [isOpen, selectedMenu]);

  // Chạy ngay khi app load
  useEffect(() => {
    fetchMenuData(selectedMenu);
  }, []);

  // Chạy lại khi selectedMenu thay đổi
  useEffect(() => {
    fetchMenuData(selectedMenu);
  }, [selectedMenu]);

  const fetchMenuData = (menu: string) => {
    setLoading(true);

    fetch(`${getJsonFile(menu)}?t=${new Date().getTime()}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!text) throw new Error("Empty JSON response");
        return JSON.parse(text);
      })
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error when fetching data:", err);
        setLoading(false);
      });
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        selectedMenu,
        setSelectedMenu,
        menuData,
        loading,
        getJsonFile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must used in SidebarProvider");
  }
  return context;
};
