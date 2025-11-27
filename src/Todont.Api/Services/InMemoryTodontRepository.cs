using System.Collections.Concurrent;
using Todont.Api.Models;

namespace Todont.Api.Services;

public class InMemoryTodontRepository : ITodontRepository
{
    private readonly ConcurrentDictionary<string, TodontList> _lists = new();

    public TodontList CreateList(string name)
    {
        var list = new TodontList { Name = name };
        _lists[list.Id] = list;
        return list;
    }

    public TodontList? GetList(string id)
    {
        _lists.TryGetValue(id, out var list);
        return list;
    }

    public TodontItem AddItem(string listId, string description, DateTime? avoidUntil)
    {
        if (!_lists.TryGetValue(listId, out var list))
        {
            throw new KeyNotFoundException($"List with id {listId} not found");
        }

        var item = new TodontItem
        {
            Description = description,
            AvoidUntil = avoidUntil
        };

        list.Items.Add(item);
        return item;
    }

    public bool UpdateItemStatus(string listId, string itemId, bool isChecked)
    {
        if (!_lists.TryGetValue(listId, out var list))
        {
            return false;
        }

        var item = list.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
        {
            return false;
        }

        item.IsChecked = isChecked;
        return true;
    }
}
