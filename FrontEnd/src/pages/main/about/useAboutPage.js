import { useEffect, useState } from 'react';

const useAboutPage = () => {
  const [selectedItem, setSelectedItem] = useState('기업소개');
  const [expandedItems, setExpandedItems] = useState({});
  const [versions, setVersions] = useState([]);
  const [selectedPatchNote, setSelectedPatchNote] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote/versions`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const versionValues = data.map(item => {
          const parsedItem = JSON.parse(item);
          return parsedItem.version;
        });
        setVersions(versionValues);
      } catch (error) {
        console.error("버전 목록을 가져오는데 실패했습니다:", error);
      }
    };
    fetchVersions();
  }, []);

  const fetchPatchNote = async (version) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote/${version}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setSelectedPatchNote(data);
    } catch (error) {
      console.error(`${version} 패치노트를 가져오는데 실패했습니다:`, error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === '패치노트') {
      setExpandedItems(prev => ({ ...prev, '패치노트': !prev['패치노트'] }));
    } else if (item.startsWith('버전')) {
      const version = item.split(' ')[1];
      fetchPatchNote(version);
    } else {
      setExpandedItems(prev => ({ ...prev, '패치노트': false }));
    }
  };

  return {
    selectedItem,
    expandedItems,
    versions,
    selectedPatchNote,
    handleItemClick
  };
};

export default useAboutPage;