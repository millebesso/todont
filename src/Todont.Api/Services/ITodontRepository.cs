using Todont.Api.Models;

namespace Todont.Api.Services;

public interface ITodontRepository
{
    TodontList CreateList(string name);
    TodontList? GetList(string id);
    TodontItem AddItem(string listId, string description, DateTime? avoidUntil);
    bool UpdateItemStatus(string listId, string itemId, bool isChecked);
    bool UpdateItem(string listId, string itemId, string description, DateTime? avoidUntil);
    bool DeleteItem(string listId, string itemId);
}
