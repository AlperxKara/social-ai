import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Trash2,
  Edit,
  Heart,
  Share2,
  Image as ImageIcon,
  Video,
  File,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const MediaLibrary: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const mediaItems = [
    {
      id: '1',
      name: 'product-launch-hero.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      uploadDate: '2024-01-15',
      url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['product', 'launch', 'hero'],
      usedIn: 3
    },
    {
      id: '2',
      name: 'team-meeting.jpg',
      type: 'image',
      size: '1.8 MB',
      dimensions: '1600x900',
      uploadDate: '2024-01-14',
      url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['team', 'meeting', 'office'],
      usedIn: 1
    },
    {
      id: '3',
      name: 'customer-testimonial.mp4',
      type: 'video',
      size: '15.2 MB',
      dimensions: '1920x1080',
      uploadDate: '2024-01-13',
      url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['testimonial', 'customer', 'video'],
      usedIn: 2
    },
    {
      id: '4',
      name: 'brand-guidelines.pdf',
      type: 'document',
      size: '3.1 MB',
      dimensions: null,
      uploadDate: '2024-01-12',
      url: null,
      tags: ['brand', 'guidelines', 'document'],
      usedIn: 0
    },
    {
      id: '5',
      name: 'social-media-template.jpg',
      type: 'image',
      size: '1.2 MB',
      dimensions: '1080x1080',
      uploadDate: '2024-01-11',
      url: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['template', 'social', 'square'],
      usedIn: 5
    },
    {
      id: '6',
      name: 'office-workspace.jpg',
      type: 'image',
      size: '2.1 MB',
      dimensions: '1920x1280',
      uploadDate: '2024-01-10',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['office', 'workspace', 'environment'],
      usedIn: 2
    }
  ];

  const filters = [
    { id: 'all', name: 'All Files', count: mediaItems.length },
    { id: 'image', name: 'Images', count: mediaItems.filter(item => item.type === 'image').length },
    { id: 'video', name: 'Videos', count: mediaItems.filter(item => item.type === 'video').length },
    { id: 'document', name: 'Documents', count: mediaItems.filter(item => item.type === 'document').length }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'document':
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Organize and manage all your media assets in one place.
          </p>
        </div>
        <Button size="lg">
          <Upload className="h-5 w-5 mr-2" />
          Upload Files
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Files
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {mediaItems.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Storage Used
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                25.8 MB
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Most Used
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                Templates
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Uploads
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                3
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <Plus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Selected Items Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Media Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all cursor-pointer group ${
                  selectedItems.includes(item.id)
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(item.type)}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate flex-1">
                      {item.name}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>{item.size}</span>
                      <span>{formatDate(item.uploadDate)}</span>
                    </div>
                    {item.dimensions && (
                      <div>{item.dimensions}</div>
                    )}
                    <div className="text-blue-600 dark:text-blue-400">
                      Used in {item.usedIn} post{item.usedIn !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    selectedItems.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(item.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>{item.size}</span>
                        {item.dimensions && <span>{item.dimensions}</span>}
                        <span>{formatDate(item.uploadDate)}</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          Used in {item.usedIn} posts
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No files found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MediaLibrary;