import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unselectAll } from '../../store/selectedItemsSlice/selectedItemsSlice';

import './flyout.css';
import { getAllItems } from '../../store/selectedItemsSlice/selectors';

const Flyout: React.FC = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(getAllItems());
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setIsFlyoutVisible(selectedItems.length > 0);
  }, [selectedItems]);

  const handleUnselectAll = () => {
    dispatch(unselectAll());
    setIsFlyoutVisible(false);
  };

  const handleDownload = () => {
    const csvContent = selectedItems.map((item) => [
      item.title,
      item.description,
      item.href,
    ]);
    const csvString = [['Title', 'Description', 'URL'], ...csvContent]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `${selectedItems.length}_items.csv`;
      downloadLinkRef.current.click();
    }
  };

  if (!isFlyoutVisible) {
    return null;
  }

  return (
    <div className="flyout">
      <span className="flyout__info">{`Selected items: ${selectedItems.length}`}</span>{' '}
      <button
        className="flyout__button flyout__button--unselect"
        onClick={handleUnselectAll}
      >
        Unselect all
      </button>
      <button
        className="flyout__button flyout__button--download"
        onClick={handleDownload}
      >
        Download
      </button>
      <a ref={downloadLinkRef} style={{ display: 'none' }}></a>
    </div>
  );
};

export default Flyout;
